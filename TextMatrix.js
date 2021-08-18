import * as mathjs from 'mathjs'

function TextMatrix(matrix) {
	return mathjs.string(matrix.toString());
}
export { TextMatrix }