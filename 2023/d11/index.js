const fs = require('fs')

let space = fs.readFileSync('./input').toString('utf-8').split('\n').map(l => l.split(''))

let h = space.length
let w = space[0].length

const expansionFactor = 1_000_000

const emptyLines = getEmptyLines()
const emptyCols = getEmptyCols()

// function expand() {
//   const res = []
//   const emptyCols = getEmptyCols()
//   console.log(emptyCols)
//   let i = 0
//   while (i < h) {
//     const newLine = []
//     let j = 0
//     while (j < w) {
//       newLine.push(space[i][j])
//       if (emptyCols.includes(j)) {
//         newLine.push('.')
//       }
//       j++
//     }
//     res.push(newLine)
//     if (newLine.every(c => c === '.')) {
//       res.push(newLine)
//     }
//     i++
//   }
//   space = res
//   h = space.length
//   w = space[0].length
// }
// expand()

function getEmptyLines() {
  return new Array(h).fill(null).map((_, j) => j).filter(i => space[i].every(s => s === '.'))
}

function getEmptyCols() {
  return new Array(w).fill(null).map((_, i) => i).filter(j => emptyCol(j))
}

function emptyCol(j) {
  let i = 0
  while (i < h) {
    if (space[i][j] === '#') {
      return false
    }
    i++
  }
  return true
}

console.log(emptyLines, emptyCols)

const stars = []
space.forEach((line, x) => {
  line.forEach((c, y) => {
    if (c === '#') {
      const nbEmptyLines = emptyLines.filter(c => c <= x).length
      const nbEmptyCols = emptyCols.filter(c => c <= y).length
      stars.push({x: x + nbEmptyLines * (expansionFactor - 1), y: y + nbEmptyCols * (expansionFactor - 1)})
    }
  })
})

function findShortestPaths() {
  const ret = []
  let i = 0
  while (i < stars.length - 1) {
    let j = i + 1
    while (j < stars.length) {
      const a = stars[i]
      const b = stars[j]
      ret.push(Math.abs(b.x - a.x) + Math.abs(b.y - a.y))
      j++
    }
    i++
  }
  return ret
}
const paths = findShortestPaths()

console.log(paths.reduce((acc, val) => acc + val, 0))
