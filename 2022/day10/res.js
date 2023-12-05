const fs = require('fs')

const instructions = fs.readFileSync('./input').toString('utf-8').split('\n').flatMap(line => {
	if (line === 'noop') {
		return [0]
	} else {
		return [0, +line.slice('addx '.length)]
	}
})

let register = 1
const nums = [register]
instructions.forEach((inst) => {
	const res = register + inst
	register = res
	nums.push(res)
})

const crt = nums.map((n, i) => {
	if (Math.abs(n - (i % 40)) <= 1) {
		return '▩'
	}
	return '.'
})
console.log(instructions)
console.log(nums)
console.log(crt)

let i = 0;
while (i < crt.length - 1) {
	console.log(crt.slice(i, i + 40).join(''))
	i += 40
}