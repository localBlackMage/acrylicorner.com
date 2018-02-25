// B(d, i)(t) = (1 - t)^(2 - i) * t^i * (d, i)
// (d, i) = pascalTriangle[d][i]
// t^i = tpow
let BernsteinFormula = function(d, t, tpow, i) {
	let dci = pascalTriangle[d][i];
	return Math.pow((1 - t), (d - i)) * tpow * dci; // Math.pow(t, i)
};

let LinearInterpolation = function(c0, c1, t) {
    let oneMinusT = (1-t);
	return {
	    x: (c0.x * oneMinusT) + (c1.x * t),
        y: (c0.y * oneMinusT) + (c1.y * t)
    };
};

let NLIShell = function(controlPoints, shellPoints, currentT) {
    let ShellPointsDict = {};
    for(let idx = 0; idx < controlPoints.length; idx++) {
        ShellPointsDict['0_' + idx] = {
            x:controlPoints[idx].x,
            y: controlPoints[idx].y
        };
    }
    for(let top = 1; top <= pointGrapher.degree; top++) {
        for(let bottom = 0; bottom <= pointGrapher.degree - top; bottom++) {
            let c0 = ShellPointsDict[(top - 1) + '_' + bottom];
            let c1 = ShellPointsDict[(top - 1) + '_' + (bottom + 1)];
            ShellPointsDict[top + '_' + bottom] = LinearInterpolation(c0, c1, currentT);
            shellPoints.push([c0, c1]);
        }
    }
};

let NLICurve = function(controlPoints, curvePoints) {
    let NLIPoints = {};
	for(let idx = 0; idx < controlPoints.length; idx++) {
        NLIPoints['0_' + idx] = {
            x: controlPoints[idx].x,
            y: controlPoints[idx].y
        };
	}
	for(let idx = 0; idx < curvePoints.length; idx++) {
        let t = idx / curvePoints.length;
		for(let top = 1; top <= pointGrapher.degree; top++) {
			for(let bottom = 0; bottom <= pointGrapher.degree - top; bottom++) {
				let c0 = NLIPoints[(top - 1) + '_' + bottom];
				let c1 = NLIPoints[(top - 1) + '_' + (bottom + 1)];
                NLIPoints[top + '_' + bottom] = LinearInterpolation(c0, c1, t);
			}
		}
		curvePoints[idx] = NLIPoints[pointGrapher.degree + '_0'];
	}
};

let BBFCurve = function(controlPoints, curvePoints) {
	for(let idx = 0; idx < curvePoints.length; idx++) {
	    let t = idx / curvePoints.length;

		let tPow = 1;
		let bernsteinScalar = BernsteinFormula(pointGrapher.degree, t, tPow, 0);
		let newPoint = {
		    x: controlPoints[0].x * bernsteinScalar,
            y: controlPoints[0].y * bernsteinScalar
        };
		for(let i = 1; i < controlPoints.length; i++) {
			tPow *= t;
			bernsteinScalar = BernsteinFormula(pointGrapher.degree, t, tPow, i);
			newPoint.x += controlPoints[i].x * bernsteinScalar;
            newPoint.y += controlPoints[i].y * bernsteinScalar;
		}

		curvePoints[idx] = newPoint;
	}
};

let _CopyPoint = function(point) {
    return {x:point.x, y:point.y};
};

let _MakePointMap = function(pointArray) {
    let map = {};
    for(let idx = 0; idx < pointArray.length; idx++) {
        map['0_' + idx] = _CopyPoint(pointArray[idx]);
    }
    return map;
};

let _NLICurve = function(controlPoints, currentDepth, _maxDepth, degree) {
    if (currentDepth >= _maxDepth) return controlPoints;

    let controlPointsMap = _MakePointMap(controlPoints);
    for(let top = 1; top <= degree; top++) {
        for(let bottom = 0; bottom <= degree - top; bottom++) {
            let c0 = controlPointsMap[(top - 1) + '_' + bottom];
            let c1 = controlPointsMap[(top - 1) + '_' + (bottom + 1)];
            controlPointsMap[top + '_' + bottom] = LinearInterpolation(c0, c1, .5);
        }
    }
    let pointsObj = {
        left: [],
        right: []
    };
    for (let idx = 0; idx <= degree; idx++){
        let accessor = idx + '_0';
        pointsObj.left.push(_CopyPoint(controlPointsMap[accessor]));
        accessor = (degree - idx) + '_' + idx;
        pointsObj.right.push(_CopyPoint(controlPointsMap[accessor]));
    }

    return _NLICurve(pointsObj.left, currentDepth+1, _maxDepth, degree).concat(_NLICurve(pointsObj.right, currentDepth+1, _maxDepth, degree));
};

let MPSDCurve = function(controlPoints) {
    JSGraph.curvePoints = [];
    JSGraph.curvePoints = _NLICurve(controlPoints, 0, pointGrapher.maxDepth, pointGrapher.degree);
};




let xTable = {};
let yTable = {};
let tArray = [];
let t = 0;

let ResetTables = function() {
    xTable = {};
    yTable = {};
    tArray = [];
};

/*
d = degree of the polynomial (input points - 1)
t = value to evaluate the polynomial at
table = x or y divided difference table to construct the polynomial from
 */
let NewtonPolynomial = function(d, t, table) {
    let tMulArray = [t];    // first multiplication is simply t - t0, t0 always equals 0

    let dSub1 = d - 1;
    for( let curT = 1; curT < dSub1; ++curT) {
        tMulArray.push(tMulArray[curT - 1] * (t - tArray[curT]));
    }

    let sum = table['0_0'];
    for( let col = 1; col < d; ++col) {
        sum += table[col + '_0'] * tMulArray[col - 1];
    }
    return sum;
};

let PolyInterpCurve = function(controlPoints, curvePoints) {
    ResetTables();
    t = controlPoints.length;
    for(let tVal = 0; tVal < t; ++tVal) {
        tArray.push(tVal);
        xTable['0_' + tVal] = controlPoints[tVal].x;
        yTable['0_' + tVal] = controlPoints[tVal].y;
    }
    for (let iter = t - 1; iter > 0; --iter) {
        let col = t - iter;
        for (let row = 0; row < iter; ++row) {
            let firstAccessor = (col - 1) + '_' + (row + 1);
            let secondAccessor = (col - 1) + '_' + (row);
            let finalAccessor = col + '_' + row;
            let denominator =  tArray[row + col] - tArray[row];

            xTable[finalAccessor] = (xTable[firstAccessor] - xTable[secondAccessor]) / denominator;
            yTable[finalAccessor] = (yTable[firstAccessor] - yTable[secondAccessor]) / denominator;
        }
    }

    let denom = curvePoints.length - 1;
    for(let idx = 0; idx < curvePoints.length; idx++) {
        let tVal = (idx / denom) * (t-1);
        curvePoints[idx] = {
            x: NewtonPolynomial(t, tVal, xTable),
            y: NewtonPolynomial(t, tVal, yTable)
        };
    }
};

class PointGrapher{
	constructor(){
		this.degree = JSGraph.degree;

		this.maxDepth = 5;
	}

    SetDegree(degree) {
	    this.degree = degree;
    }

    SetMaxDepth(depth) {
	    this.maxDepth = depth;
    }

	SetCurvePoints() {
		JSGraph.curvePoints = [];
		let numCPs = this.degree * 50;
		for(let x = 0; x < numCPs; x++) {
			JSGraph.curvePoints.push({x: 0, y: 0});
		}
	}
}