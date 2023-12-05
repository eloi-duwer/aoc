const fs = require('fs')

const A = 'a'.charCodeAt(0)
const Z = 'z'.charCodeAt(0)

const map = fs.readFileSync('./input').toString('utf-8').split('\n').flatMap((s, i) => s.split('').map((c, j) => ({
	dist: c === null,
	height: c === 'S' ? A : (c === 'E' ? Z : c.charCodeAt(0)),
	start: c === 'S' || c === 'a',
	end: c === 'E',
	x: i,
	y: j
})))

const starts = map.filter(c => c.start === true)

const min = starts.reduce((minDist, start, i) => {
	console.log(`Testing ${i + 1} out of ${starts.length}`)
	const shortest = findShortest(map, start, minDist)
	console.log(`Got ${shortest}, current shortest is ${minDist}`)
	if (shortest < minDist) {
		return shortest
	}
	return minDist
}, Infinity)
console.log(min)


function findShortest(_map, startingPoint, currentShortest) {
	const map = _map.slice().map(m => {
		const isStart = m.x === startingPoint.x && m.y === startingPoint.y
		return {
			...m,
			start: isStart,
			dist: isStart ? 0 : null
		}
	})
	const toVisit = map.filter(m => m.start === true)

	function findNeighbors(cell) {
		const ret = [
			...map.filter(m => m.x === cell.x && Math.abs(cell.y - m.y) === 1),
			...map.filter(m => m.y === cell.y && Math.abs(cell.x - m.x) === 1),
		].filter(m => m.height <= cell.height + 1)
		return ret
	}
	
	while (true) {
		const curr = toVisit.shift()

		if (curr == null) {
			return Infinity
		}
		const neighbors = findNeighbors(curr)
		// console.log({curr, neighbors})
		if (neighbors.some(n => n.end === true)) {
			return curr.dist + 1
		}
		neighbors.forEach(n => {
			if (n.dist == null || n.dist > curr.dist + 1) {
				n.dist = curr.dist + 1
				toVisit.push(n)
			}
		})
	}
}
