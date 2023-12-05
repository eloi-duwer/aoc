const fs = require('fs')
const lines = fs.readFileSync('input').toString('utf-8').split('\n')

const sum = lines.reduce((sum, line) => sum + findDigits(line), 0)

console.log(sum)

function findDigits(line) {
	const digits = {
		'one': 1,
		'two': 2,
		'three': 3,
		'four': 4,
		'five': 5,
		'six': 6,
		'seven': 7,
		'eight': 8,
		'nine': 9,
	}
	const digitsReg = Object.keys(digits).join('|')

	const firstRegexp = new RegExp(`\\D*?(?<digit>\\d|${digitsReg}).*`)
	const lastRegexp = new RegExp(`.*(?<digit>\\d|${digitsReg})\\D*?`)
	const firstDigit = line.match(firstRegexp)
	const lastDigit = line.match(lastRegexp)
	let f = firstDigit.groups.digit
	if (isNaN(+f)) {
		f = digits[f]
	}
	let l = lastDigit.groups.digit
	if (isNaN(+l)) {
		l = digits[l]
	}
	return +('' + f + l)
}