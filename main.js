import "./style.css"

import {tupla} from "./calc"

//import {Gauss} from "./gauss"

//import * as mathjs from "mathjs";
import { TextMatrix } from "./TextMatrix";


import { create, all } from "mathjs";
const mathjs = create(all);


mathjs.config({
	number: "Fraction"
})



function MultiplyFromLine(matrixA, denomLinePos){
	let rowsAmount = matrixA.size()[0];
	let columnsAmount = matrixA.size()[1];
	let denomLine = mathjs.row(matrixA, denomLinePos);
	denomLine = mathjs.squeeze(denomLine);

	for (let numerLinePos = denomLinePos + 1; numerLinePos < matrixA.size()[0]; numerLinePos++){

		let numerLine = mathjs.row(matrixA, numerLinePos);
		numerLine = mathjs.squeeze(numerLine);

		//let multiplier = numerLine(denomLinePos) / denomLine(denomLinePos);
		let numerator = numerLine.subset(mathjs.index(denomLinePos)) ;
		let denominator = denomLine.subset(mathjs.index(denomLinePos));

		let multiplierText = mathjs.divide(numerator, denominator);
		let multiplier = mathjs.fraction({n: numerator, d: denominator});

		console.log("Multiplier at line  " + (numerLinePos + 1) + " is m" + (numerLinePos + 1) + "" + (denomLinePos+1) + 
			" = (" + numerator.toFraction() + ")/(" + denominator.toFraction() + ") = " + multiplier);

		console.log("L" + (numerLinePos + 1) + " <== L" + (numerLinePos + 1) + " - (" + multiplier + ")L" + (denomLinePos + 1));
		
		numerLine = mathjs.subtract(numerLine, mathjs.multiply(denomLine, multiplier));

		matrixA.subset(mathjs.index(numerLinePos, mathjs.range(0, columnsAmount)), numerLine);
		console.log('\nMatrix A = \n' + TextMatrix(matrixA)+"\n");
	}
}




function Gauss(matrixA) {
	let step = 1;

	console.log("Input Matrix A = \n" + TextMatrix(matrixA));

	for (let currentLinePos = 0; currentLinePos < matrixA.size()[0] - 1; currentLinePos++) {
		console.log("---------------------------------------------------------\nStep " + step++ + ":\n");
		MultiplyFromLine(matrixA, currentLinePos);
	}
	console.log("=========================================================\nFinal Matrix A =\n" + TextMatrix(matrixA));
}





function PivotFromColumn(matrixA, columnPos) {
	let rowsAmount = matrixA.size()[0];
	let columnsAmount = matrixA.size()[1];

	let currentColumn = mathjs.row(matrixA, columnPos);
	currentColumn = mathjs.squeeze(currentColumn);
	let columnInStudy = mathjs.subset(matrixA, mathjs.index(mathjs.range(columnPos, rowsAmount), columnPos));
	columnInStudy = mathjs.squeeze(columnInStudy);

	let maxInfoStudy = MaxAbsWithPos(columnInStudy);

	let maxInfo = {max: maxInfoStudy.max, pos: maxInfoStudy.pos + columnPos};

	console.log(maxInfo.pos, columnPos)

	if (maxInfo.pos != columnPos){
		console.log("Pivoting the matrix in column " + (columnPos + 1) + " is required.\n");
		console.log("" + maxInfo.max.toFraction() + " is the maximum in column " + (columnPos + 1) + " with position " + (maxInfo.pos + 1) + "\n");
		console.log("\nPivoting: L" + (columnPos + 1) + " <--> L" + (maxInfo.pos + 1) + "\n");

		let temp = mathjs.row(matrixA, columnPos);
		matrixA.subset(mathjs.index(columnPos, mathjs.range(0, columnsAmount)), mathjs.row(matrixA, maxInfo.pos));
		matrixA.subset(mathjs.index(maxInfo.pos, mathjs.range(0, columnsAmount)), temp);
		console.log('\nPivoted Matrix A = \n' + TextMatrix(matrixA));

		console.log('.........................................................\n');
	}

}

function MaxAbsWithPos(array){
	let valueScore = -1;
	let positionScore = -1;
	for (let i = 0; i < array.size(); i++){
		let currentValue = array.subset(mathjs.index(i));
		if (mathjs.abs(currentValue) > mathjs.abs(valueScore)){
			valueScore = currentValue;
			positionScore = i;
		}
	}

	return {max: valueScore, pos: positionScore};
}




function GaussPivot(matrixA) {
	let step = 1;

	console.log("Input Matrix A = \n" + TextMatrix(matrixA));

	for (let currentLinePos = 0; currentLinePos < matrixA.size()[0] - 1; currentLinePos++) {
		console.log("---------------------------------------------------------\nStep " + step++ + ":\n");
		PivotFromColumn(matrixA, currentLinePos);
		MultiplyFromLine(matrixA, currentLinePos);
	}
	console.log("=========================================================\nFinal Matrix A =\n" + TextMatrix(matrixA));
}



/*const a = mathjs.matrix([]);
const b = mathjs.matrix([4, 5 ,6]);
//const c = mathjs.matrix([a, b]);
const c = mathjs.matrix([a]);
c.subset(mathjs.index(1, mathjs.range(0, b.size()[0])), b);*/

/*console.log(TextMatrix(a));
console.log(TextMatrix(b));
console.log(TextMatrix(c));*/


function FillWithFractions(textMatrix){
	let newMatrix = mathjs.matrix([]);

	for(let lines = 0; lines < textMatrix.length; lines++){
		let currentLineInput = textMatrix[lines];
		let currentLine = mathjs.matrix([]);
		for (let columns = 0; columns < currentLineInput.length; columns++) {
			let fraction = mathjs.fraction(textMatrix[lines][columns]);
			currentLine.subset(mathjs.index(columns), fraction);
		}
		newMatrix.subset(mathjs.index(lines, mathjs.range(0, currentLine.size()[0])), currentLine);
	}

	console.log("Fractions: " + TextMatrix(newMatrix));

	return newMatrix;

}




/*const matrix = mathjs.matrix([[1, 1, 1, 3], [2, -1, 3, 4], [5, 3, -6, 2]]);
const t = mathjs.matrix([[0.0002, 2, 5], [2, 2, 6]]);
const t2 = mathjs.matrix([[1, -1, 2, 2], [2, -2, -1, 4], [-1, -5, 3, 4]]);*/


//const tInput = [["1", "-1", "2", "2"], ["2", "-2", "-1", "4"], ["-1", "-5", "3", "4"]];
const tInput = [["1", "1", "1", "3"], ["2", "-1", "3", "4"], ["5", "3", "-6", "2"]];

let t = FillWithFractions(tInput);

GaussPivot(t);


//console.log(mathjs.string(matrix.toString()));

//GaussPivot(t2);

//console.log(mathjs.print(mathjs.subset(matrix, mathjs.index(1, 0))  ))

/*let a = mathjs.fraction("2/3");
let b = mathjs.fraction("7/4");

let c = mathjs.sum(a, b);
let d = mathjs.subtract(a, a);
let e = mathjs.multiply(a, b);

console.log(a.toFraction());
console.log(b.toFraction());
console.log(c.toFraction());
console.log(d.toFraction());
console.log(e.toFraction());

console.log(tupla(3,4));*/


document.querySelector("#app").innerHTML = `
  <h1>Hello Vite!</h1>
  <a href="https://vitejs.dev/guide/features.html" target="_blank">Documentation</a>
`
