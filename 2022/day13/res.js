const fs = require('fs')

const input = fs.readFileSync('./input').toString('utf-8').split('\n\n').flatMap(p => p.split('\n').map(s => JSON.parse(s)))

const divA = [[2]]
const divB = [[6]]

const pairs = [
	...input,
	divA,
	divB
]

pairs.sort((a, b) => {
	if (isEqual(a, b)) {
		return -1
	}
	return +1
})

console.log(pairs)

const indA = pairs.indexOf(divA) + 1
const indB = pairs.indexOf(divB) + 1

console.log(indA * indB)

function isEqual(arrA, arrB) {
	let i = 0
	let ret
	while (i < arrB.length) {
		let a = arrA[i]
		let b = arrB[i]
		const ta = typeof a
		const tb = typeof b
		if (a == null) {
			ret = true
		}
		else if (ta === 'number' && tb === 'number') {
			if (a < b) {
				ret = true
			} else if (a > b) {
				ret = false
			}
		} else if (ta === 'object' && tb === 'object') {
			ret = isEqual(a, b)
		} else {
			if (ta === 'number') {
				a = [a]
			}
			if (tb === 'number') {
				b = [b]
			}
			ret = isEqual(a, b)
		}
		if (ret !== undefined) {
			return ret	
		}
		i++
	}
	if (arrA.length < arrB.length) {
		return true
	} else if (arrA.length === arrB.length) {
		return undefined
	} else {
		return false
	}
}