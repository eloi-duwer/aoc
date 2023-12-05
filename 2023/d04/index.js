const fs = require('fs')

const lines = fs.readFileSync('input').toString('utf-8').split('\n').map(l => l.slice('Card 1: '.length))
const cards = new Array(lines.length).fill(1)

lines.forEach((line, index) => {
  const n = cards[index]
  let wins = nWins(line)
  while (wins > 0) {
    cards[index + 1] += n
    index++
    wins--
  }
})

console.log(cards.reduce((acc, val) => acc + val, 0))

function nWins(line) {
  const [w, a] = line.split('|').map(s => s.split(' ').filter(n => n != null && n != '').map(n => +n))
  const matches = a.filter(n => w.indexOf(n) !== -1)

  return matches.length
}

// const sum = lines.reduce((acc, line) => acc + linePoints(line), 0)

// console.log(sum)

// function linePoints(line) {
//   const [w, a] = line.split('|').map(s => s.split(' ').filter(n => n != null && n != '').map(n => +n))
//   const matches = a.filter(n => w.indexOf(n) !== -1)
//   console.log(matches.length)
//   if (matches.length === 0)
//     return 0
//   return Math.pow(2, matches.length - 1)
// }