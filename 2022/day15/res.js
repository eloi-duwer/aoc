const fs = require('fs')

const sensors = fs.readFileSync('./input').toString('utf-8').split('\n')

const target = 2000000

const occupied = new Set()
const beacons = []

sensors.forEach(sens => {
	let [s, b] = sens.split(': closest beacon is at x=')
	s = s.slice('Sensor at x='.length)
	let { sx, sy } = s.match(/(?<sx>-?\d+), y=(?<sy>-?\d+)/).groups
	let { bx, by } = b.match(/(?<bx>-?\d+), y=(?<by>-?\d+)/).groups
	// console.log({sx, sy, bx, by})

	sx = +sx
	sy = +sy
	bx = +bx
	by = +by

	if (by === target) {
		beacons.push(bx)
	}

	const dist = Math.abs(bx - sx) + Math.abs(by - sy)
	
	const verticalDist = Math.abs(sy - target)
	if (verticalDist > dist) {
		return
	}
	
	const remaining = dist - verticalDist
	
	let start = sx - remaining
	// console.log({start, end: sx + remaining, dist, verticalDist, remaining})
	
	while (start <= sx + remaining) {
		occupied.add(start)
		start++
	}
})

// console.log(beacons)
// console.log(occupied)
console.log([...occupied.keys()].filter(a => !beacons.includes(a)).length)