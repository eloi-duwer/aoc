const fs = require('fs')

const path = fs.readFileSync(__dirname + '/input').toString('utf-8').split('\n')

const h = path.length
const w = path[0].length

const map = new Array(h).fill(0).map(l => new Array(w).fill('.'))
const debug = new Array(h).fill(0).map(l => new Array(w).fill('.'))

const s = findS(path)
map[s.x][s.y] = 0

function findS(path) {
  let i = 0
  while (i < h) {
    let j = 0
    while (j < w) {
      if (path[i][j] === 'S') {
        return {
          x: i, y: j
        }
      }
      j++
    }
    i++
  }
}

const next = []

function afterS() {
  const t = path[s.x - 1]?.[s.y]
  const b = path[s.x + 1]?.[s.y]
  const l = path[s.x]?.[s.y - 1]
  const r = path[s.x]?.[s.y + 1]
  const n = 1

  if (t === '|' || t === '7' || t === 'F') {
    next.push({x: s.x - 1, y: s.y, s: n})
    return
  }
  if (b === '|' || b === 'J' || b === 'L') {
    next.push({x: s.x + 1, y: s.y, s: n})
    return
  }
  if (l === '-' || l === 'F' || l === 'L') {
    next.push({x: s.x, y: s.y - 1, s: n})
    return
  }
  if (r === '-' || r === 'J' || r === '7') {
    next.push({x: s.x, y: s.y + 1, s: n})
    return
  }
}
afterS()

function replaceS() {
  const t = path[s.x - 1]?.[s.y]
  const b = path[s.x + 1]?.[s.y]
  const l = path[s.x]?.[s.y - 1]
  const r = path[s.x]?.[s.y + 1]

  const isTop = (t === '|' || t === '7' || t === 'F')
  const isBottom = (b === '|' || b === 'J' || b === 'L')
  const isLeft = (l === '-' || l === 'F' || l === 'L')
  const isRight = (r === '-' || r === 'J' || r === '7')

  const c = isTop && isBottom ? '|' : (isTop && isLeft ? 'J' : (isTop && isRight ? 'L' : (isLeft && isRight ? '-' : (isLeft && isBottom ? '7' : 'F'))))
  path[s.x] = path[s.x].replace('S', c)
}
replaceS()

let max = 0
function fillMap() {
  while (next.length) {
    const n = next.shift()
    map[n.x][n.y] = n.s
    if (max < n.s) {
      max = n.s
    }
    const nextP = nextPos(n)
    if (nextP) {
      next.push(nextP)
    }
  }
}
fillMap()

function cleanPath() {
  let i = 0
  while (i < h) {
    let j = 0
    while (j < w) {
      if (map[i][j] === '.') {
        path[i] = path[i].split('')
        path[i][j] = '.'
        path[i] = path[i].join('')
      }
      j++
    }
    i++
  }
}
cleanPath()
console.log(path)
console.log(map)

function nextPos(n) {
  const s = map[n.x][n.y] + 1
  const l = path[n.x][n.y]
  if (l === '|' || l === 'J' || l === 'L') { // TOP
    if (map[n.x - 1]?.[n.y] === '.') {
      return { x: n.x - 1, y: n.y, s }
    }
  }
  if (l === '|' || l === '7' || l === 'F') { // BOTTOM
    if (map[n.x + 1]?.[n.y] === '.') {
      return { x: n.x + 1, y: n.y, s }
    }
  }
  if (l === '-' || l === 'J' || l === '7') { // LEFT
    if (map[n.x]?.[n.y - 1] === '.') {
      return { x: n.x, y: n.y - 1, s }
    }
  }
  if (l === '-' || l === 'L' || l === 'F') { // RIGHT
    if (map[n.x]?.[n.y + 1] === '.') {
      return { x: n.x, y: n.y + 1, s }
    }
  }
}

console.log(max)

let i = 0
let nins = 0
while (i < h) {
  let isIn = false
  let prevWall = false
  let wallStart = ''
  let j = 0
  prev = map[i][j]
  if (i === 0) {
    console.log(path[i])
  }
  while (j < w - 1) {
    const inWall = map[i][j] !== '.'
    if (inWall) {
      debug[i][j] = '+'
    }

    if ((inWall && !prevWall) || path[i][j] === 'F' || path[i][j] === 'L') {
      isIn = !isIn
      wallStart = path[i][j]
    }

    else if (path[i][j] === '7' && wallStart === 'F') {
      isIn = !isIn
    }
    else if (path[i][j] === 'J' && wallStart === 'L') {
      isIn = !isIn
    }
    
    else if (inWall && prevWall && !consecutive(map[i][j], prev)) {
      isIn = !isIn
    }

    if (map[i][j] === '.' && isIn === true) {
      debug[i][j] = '#'
      nins++
    }
    prev = map[i][j]
    prevWall = map[i][j] !== '.'
    j++
  }
  i++
}

function consecutive(a, b) {
  return Math.abs((a % max) - (prev % max)) <= 1
}

fs.writeFileSync('./res.txt', debug.map(m => m.join('')).join('\n'))
console.log(nins)
