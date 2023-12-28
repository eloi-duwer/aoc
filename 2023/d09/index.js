const fs = require('fs')

const lines = fs.readFileSync('./input').toString('utf-8').split('\n')

const sum = lines.reduce((acc, val) => acc + findNext(val), 0)
console.log(sum)

function findNext(line) {
  line = [line.split(' ').map(n => +n)]
  while (!allZeroes(line[line.length - 1])) {
    const last = line[line.length - 1]
    const next = new Array(last.length - 1)
    let i = 0
    while(i < last.length - 1) {
      next[i] = last[i + 1] - last[i]
      i++
    }
    line.push(next)
  }
  let i = line.length - 2
  while (i >= 0) {
    const l = line[i]
    const n = line[i + 1]
    l.unshift(l[0] - n[0])
    i--
  }
  console.log(line[0][line[0].length - 1])
  return line[0][0]
}

function allZeroes(line) {
  return line.every(n => n === 0)
}