const fs = require('fs')
const commands = fs.readFileSync('./input').toString('utf-8').split('\n').flatMap(l => {
  const [dir, n] = l.split(' ')
  return new Array(+n).fill(dir)
})
let visited = new Set()
const strPos = ({x, y}) => `${x},${y}`
const SIZE = 10
const H = 0
const T = SIZE - 1
const snake = new Array(SIZE).fill({x: 0, y: 0})
const moves = {
  'U': ({x, y}) => ({x: x, y: y + 1}),
  'D': ({x, y}) => ({x: x, y: y - 1}),
  'L': ({x, y}) => ({x: x - 1, y: y}),
  'R': ({x, y}) => ({x: x + 1, y: y})
}
function move (n) {
  if (n < 0) {
    return -1
  } else if (n === 0) {
	return 0
  }
  return 1
}

commands.forEach((c, index) => {
  snake[H] = moves[c](snake[H])
  let i = 1;
  while (i < SIZE) {
    const head = snake[i - 1]
    const tail = snake[i]
	  const diffX = Math.abs(head.x - tail.x)
    const diffY = Math.abs(head.y - tail.y)

    if (diffX + diffY <= 1 || (diffX === 1 && diffY === 1)) {
      // No need to move	
    } else {
      snake[i] = {
        x: tail.x + move(head.x - tail.x),
        y: tail.y + move(head.y - tail.y)
      }
    }
    i++
  }
  visited.add(strPos(snake[T]))
})

function findBoundaries() {

  const Xs = [...snake.map(s => s.x), ...([...visited].map(v => +(v.split(',')[0])))]
  const Ys = [...snake.map(s => s.y), ...([...visited].map(v => +(v.split(',')[1])))]

  const startY = Ys.reduce((acc, val) => val > acc ? val : acc, 0) + 2
  const endY   = Ys.reduce((acc, val) => val < acc ? val : acc, 0) - 2
  const startX = Xs.reduce((acc, val) => val < acc ? val : acc, 0) - 2
  const endX   = Xs.reduce((acc, val) => val > acc ? val : acc, 0) + 2

  return {
    startX,
    startY,
    endX,
    endY
  }
}

function draw() {
  const { startX, startY, endX, endY } = findBoundaries()
  let y = startY
  while (y != endY) {
    let line = ''
    let x = startX
    while (x != endX) {
      if (x === 0  && y === 0) {
        line += 'S'
      }
    else {
      const snakeIndex = snake.findIndex(s => s.x === x && s.y === y)
      if (snakeIndex != -1) {
        line += snakeIndex
      } else if (visited.has(strPos({x, y}))) {
        line += '#'
      } else {
        line += '.'
      }
    }
      x++
    }
    console.log(line)
    y--
  }
}

draw()
console.log([...visited].length)