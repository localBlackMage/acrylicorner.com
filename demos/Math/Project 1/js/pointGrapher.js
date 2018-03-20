// B(d, i)(t) = (1 - t)^(2 - i) * t^i * (d, i)
// (d, i) = pascalTriangle[d][i]
// t^i = tpow
let BernsteinFormula = function(d, t, tpow, i) {
	let dci = pascalTriangle[d][i];
	return Math.pow((1 - t), (d - i)) * tpow * dci; // Math.pow(t, i)
};

let LinearInterpolation = function(c0, c1, t) {
	return c0 * (1 - t) + c1 * t;
};

let NLICurve = function(controlPoints, curvePoints) {
	let coefficients = {};
	for(let idx = 0; idx < controlPoints.length; idx++) {
		coefficients['0' + idx] = pointGrapher.ScreenToValueY(controlPoints[idx].y);
	}
	for(let idx = 0; idx < curvePoints.length; idx++) {
		let t = pointGrapher.ScreenToValueX(curvePoints[idx].x);
		for(let top = 1; top <= pointGrapher.degree; top++) {
			for(let bottom = 0; bottom <= pointGrapher.degree - top; bottom++) {
				let c0 = coefficients[(top - 1) + '' + bottom];
				let c1 = coefficients[(top - 1) + '' + (bottom + 1)];
				coefficients[top + '' + bottom] = LinearInterpolation(c0, c1, t);
			}
		}	
		curvePoints[idx].y = pointGrapher.ValueToScreenCoordY(coefficients[pointGrapher.degree + '0']);
	}
};

let BBFCurve = function(controlPoints, curvePoints) {
	let cpYvals = [];
	for(let idx = 0; idx < controlPoints.length; idx++) {
		cpYvals.push(pointGrapher.ScreenToValueY(controlPoints[idx].y));
	}
	
	for(let idx = 0; idx < curvePoints.length; idx++) {
		let t = pointGrapher.ScreenToValueX(curvePoints[idx].x);
		
		let tPow = 1;
		let y = cpYvals[0] * BernsteinFormula(pointGrapher.degree, t, tPow, 0);
		for(let i = 1; i < cpYvals.length; i++) {
			tPow *= t;
			y += cpYvals[i] * BernsteinFormula(pointGrapher.degree, t, tPow, i);
		}
		curvePoints[idx].y = pointGrapher.ValueToScreenCoordY(y);
	}
};

class PointGrapher{
	constructor(){
		this.gridInfo = JSGraphics.gridInfo;
		this.degree = 0;
	}

    WriteControlPoints(controlPoints) {
		let cps = [];
        for(let x = 0; x < controlPoints.length; x++) {
            cps.push({
            	x: this.ScreenToValueX(controlPoints[x].x),
				y: this.ScreenToValueY(controlPoints[x].y)
			});
        }
        document.getElementById('ui-textarea').value = JSON.stringify(cps);
	}
	
	SetCurvePoints() {
		let y = this.ValueToScreenCoordY(1);
		JSGraph.curvePoints = [];
		for(let x = this.gridInfo.left; x < this.gridInfo.right; x++) {
			JSGraph.curvePoints.push({x: x, y: y});
		}
	}
	
	// Creates degree + 1 points for the user to manipulate
	SetControlPoints(degree) {	
		degree = Number.parseInt(degree);
		this.degree = degree;
		JSGraph.ResetControlPoints();
		for(let t = 0; t < degree + 1; t++) {
			JSGraph.AddControlPoint(this.ValueToScreenCoordX(t / degree), this.ValueToScreenCoordY(1));
		}
		JSGraph.CalculateCurve();
		JSGraph.Draw();
	}
	
	ScreenToValueY(yScreenCoord) {
		return -((((yScreenCoord - this.gridInfo.top) / this.gridInfo.height) * 6) - 3);
	}
	
	ScreenToValueX(xScreenCoord) {
		return ((xScreenCoord - this.gridInfo.left) / this.gridInfo.width);
	}
	
	
	
	ValueToScreenCoordY(yValue) {
		let y = 1 - (((yValue) + 3) / 6);
		return this.gridInfo.top + (y * this.gridInfo.height);
	}

	ValueToScreenCoordX(xValue) {
		return this.gridInfo.left + (xValue * this.gridInfo.width);
	}
}