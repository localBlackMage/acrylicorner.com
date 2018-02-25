let pascalTriangle = {
	0: [1], 1: [1, 1]
};

let generatePascalRow = function (rowNum) {
	pascalTriangle[rowNum] = Array(rowNum + 1);
	pascalTriangle[rowNum].fill(1);
	
	for (let i = 1; i < rowNum; i++) {
		pascalTriangle[rowNum][i] = pascalTriangle[rowNum - 1][i - 1] + pascalTriangle[rowNum - 1][i];
	}
};

for(let i = 2; i<=80;i++) {
	generatePascalRow(i);
}
