const fs = require('fs')

const lines = fs.readFileSync('input').toString('utf-8').split('\n')

console.log(lines)

const numbers = lines.flatMap((line, index) => parseLine(line, index))

function parseLine(line, index) {
	const ret = new Array(line.length).fill(null)
	const re = /\d+/g
	while (match = re.exec(line)) {
		let l = match[0].length
		const number = +(match[0])
		while (l > 0) {
			l--
			ret[match.index + l] = {
				n: number,
				x: index,
				y: match.index,
				rx: index,
				ry: match.index + l
			}
		}
	}

	return ret.filter(n => n)
}

console.log(numbers)

const sum = lines.reduce((acc, line, index) => acc + ratio(line, index), 0)

console.log(sum)

function ratio(line, index) {
	const re = /\*/g
	let sum = 0
	while (match = re.exec(line)) {
		sum += findRatio(match, index)
	}
	return sum
}

function findRatio(match, index) {
	const nearNumbers = []
	for (i = -1; i <= 1; i++) {
		for (j = -1; j <= 1; j++) {
			const matchNumber = numbers.find(n => n.rx === index + i && n.ry === match.index + j)
			if (matchNumber) {
				if (!nearNumbers.find(n => n.x === matchNumber.x && n.y === matchNumber.y)) {
					nearNumbers.push(matchNumber)
				}
			}
		}
	}
	if (nearNumbers.length > 2) {
		console.log('ERROR 3 ADJACENT NUMBERS')
		process.exit(1)
	}
	if (nearNumbers.length === 2) {
		return nearNumbers[0].n * nearNumbers[1].n
	}
	return 0
}

// const sum = lines.reduce((acc, line, i) => acc + sumLine(line, i), 0)

// console.log(sum)

// function sumLine(line, index) {
// 	const re = /\d+/g
// 	let sum = 0
// 	while (match = re.exec(line)) {
// 		if (isNumberNearSymbol(index, match.index, match[0].length)) {
// 			sum += +(match[0])
// 		}
// 	}
// 	return sum
// }

// function isNumberNearSymbol(i, i2, l) {
// 	while (l > 0) {
// 		l--
// 		if (isNearSymbol(i, i2 + l)) {
// 			return true
// 		}
// 	}
// 	return false
// }

// function isNearSymbol(x, y) {
// 	for (i = -1; i <= 1; i++) {
// 		for (j = -1; j <= 1; j++) {
// 			if (x + i >= 0 && x + i < lines.length && y + j >= 0 && y + j < lines[0].length) {
// 				console.log({ x, y, i, j })
// 				if (isSymbol(lines[x + i][y + j])) {
// 					return true
// 				}
// 			}
// 		}
// 	}
// 	return false
// }

// function isSymbol(c) {
// 	return c != '.'
// 		&& c != '0'
// 		&& c != '1'
// 		&& c != '2'
// 		&& c != '3'
// 		&& c != '4'
// 		&& c != '5'
// 		&& c != '6'
// 		&& c != '7'
// 		&& c != '8'
// 		&& c != '9'
// }