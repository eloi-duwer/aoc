const fs = require('fs')

let [instructions, m] = fs.readFileSync(__dirname + '/input').toString('utf-8').split('\n\n')

console.log(instructions, m)
m = m.split('\n')
instructions = instructions.split('').map(i => i === 'L' ? 0 : 1)

const map = []
const starts = []
const ends = []

m.forEach(line => {
  const [source, dest] = line.split(' = ')
  const idA = findIndex(source)
  const [l, r] = dest.slice(1, -1).split(', ')
  const idL = findIndex(l)
  const idR = findIndex(r)

  map[idA] = [idL, idR]
  if (source.endsWith('A')) {
    starts.push(idA)
  }
  if (source.endsWith('Z')) {
    ends.push(idA)
  }
})

function findIndex(pos) {
  const a =  'A'.charCodeAt(0)
  const ret = (pos.charCodeAt(2) - a) * 1
    + ((pos.charCodeAt(1) - a) * 26)
    + ((pos.charCodeAt(0) - a) * 26 * 26)
  return ret
}

function followPath() {
  let steps = 0
  let idx = 0
  const len = instructions.length
  let curr = starts
  let stepSize = 1
  let foundEndsIndexes = Array(curr.length).fill(() => 0).map(_ => [])
  let foundEndsSteps = Array(curr.length).fill(() => 0).map(_ => [])
  const loopIsFound = Array(curr.length).fill(false)
  while (true) {
    let allEnds = true
    const inst = instructions[idx]
    let i = 0
    while (i < curr.length) {
      curr[i] = map[curr[i]][inst]
      if (!ends.includes(curr[i])) {
        allEnds = false
      } else if (!loopIsFound[i]) {
        if (foundEndsIndexes[i].includes(idx)) {
          console.log(`Found new loop at index ${idx}`)
          const endIndex = foundEndsIndexes[i].indexOf(idx)
          const loopSize = steps - foundEndsSteps[i][endIndex]
          console.log(`Loop size is ${loopSize}`)
          stepSize = ppcm(stepSize, loopSize)
          console.log(`New step size is ${stepSize}`)
          loopIsFound[i] = true
        } else {
          foundEndsIndexes[i].push(idx)
          foundEndsSteps[i].push(steps)
        }
      }
      i++
    }
    idx++
    steps++
    idx %= len
    if (allEnds) {
      return steps
    }
    if (steps % 1000000 === 0) {
      console.log(steps)
    }
  }
}

console.log(followPath())

function ppcm(a, b) {
  return (a * b) / pgcd(a, b)
}

function pgcd(a, b) {
  while (b != 0) {
    const t = b
    b = a % b
    a = t
  }
  return a
}