const fs = require('fs')

const lines = fs.readFileSync('input').toString('utf-8').split('\n')


const sum = lines.reduce((acc, val, i) => {
	const parsed = val.match(/Game \d+: (?<line>.*)/)
	// return acc + isPossible(parsed.groups.line, i + 1)
	return acc + getPower(parsed.groups.line)
}, 0)

console.log(sum)

function getPower(line) {
	let max = {
		red: 0,
		green: 0,
		blue: 0
	}

	const parsed = line
		.split(';')
		.flatMap(s => s
			.trim()
			.split(',')
			.map(c => c
				.trim(' ')
				.split(' ')
			)
		)

	parsed.forEach(color => {
		if (+color[0] > max[color[1]]) {
			max[color[1]] = +color[0]
		}
	});

	return max.green * max.red * max.blue
}

function isPossible(line, index) {

	const max = {
		red: 12,
		green: 13,
		blue: 14
	}

	const isPossible = line
		.split(';')
		.every(set => set
				.split(',')
				.map(c => c.trim())
				.every(color => {
					color = color.split(' ')
					if (+color[0] > max[color[1]]) {
						return false
					}
					return true
				})
	)

	if (isPossible) {
		return index
	}
	return 0
}