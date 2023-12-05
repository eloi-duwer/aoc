const fs = require('fs')

const rocks = fs.readFileSync('./input').toString('utf-8').split('\n')

const filled = new Set()

rocks.forEach(r => {
	const points = r.split(' -> ')
	let i = 0
	while (i < points.length - 1) {
		const a = points[i]
		const b = points[i + 1]
		let [xa, ya] = a.split(',').map(_ => +_)
		let [xb, yb] = b.split(',').map(_ => +_)
		const diffx = xb - xa
		const diffy = yb - ya
		const stepx = diffx / Math.abs(diffx) || 0
		const stepy = diffy / Math.abs(diffy) || 0
		// console.log({a, b, diffx, diffy, stepx, stepy})
		if (xa !== xb) {
			filled.add(`${xa},${ya}`)
			do {
				xa += stepx
				filled.add(`${xa},${ya}`)
			} while (xa != xb)
		}
		if (ya !== yb) {
			filled.add(`${xa},${ya}`)
			do {
				ya += stepy	
				filled.add(`${xa},${ya}`)
			} while (ya != yb)
		}
		i++
	}
})

const maxY = [...filled.values()].reduce((acc, val) => {
	const y = +val.split(',')[1]
	if (y > acc)
		return y
	return acc
}, 0) + 2

function fallsForever(p) {
	let y = p.y
	while (y <= maxY) {
		if (!filled.has(str({x: p.x ,y})))
			return false
		y++
	}
	return true
}

function str(p) {
	return p.x + ',' + p.y
}

function genMoves(p) {
	if (p.y + 1 === maxY) {
		return []
	}
	return [
		{x: p.x, y: p.y + 1},
		{x: p.x - 1, y: p.y + 1},
		{x: p.x + 1, y: p.y + 1}
	].filter (np => !filled.has(str(np)))
}

let i = 0
while (true) {
	if (filled.has('500,0')) {
		console.log(i)
		return
	}
	let sand = {x: 500, y: 0}
	while (true) {
		moves = genMoves(sand)
		if (moves.length === 0) {
			filled.add(str(sand))
			break
		}
		else {
			sand = moves[0]
		}
	}
	i++
}