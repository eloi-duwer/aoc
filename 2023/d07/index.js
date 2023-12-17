const fs = require('fs')

const hands = fs.readFileSync('input').toString('utf-8').split('\n')

let res = 0

const sorted = [
  'A',
  'K',
  'Q',
  'T',
  '9',
  '8',
  '7',
  '6',
  '5',
  '4',
  '3',
  '2',
  'J'
]

const maxScores = {}

hands.sort((a, b) => {
  const aStr = memoizedFindStrength(a)
  const bStr = memoizedFindStrength(b)

  if (aStr === bStr) {
    return findWorst(a, b)
  }
  return aStr - bStr
})

console.log(hands)

function memoizedFindStrength(hand) {
  if (!maxScores[hand]) {
    maxScores[hand] = findStrength(hand)
  }

  return maxScores[hand]
}

function findStrength(hand) {
  hand = hand.split(' ')[0]
  hand = replaceJs(hand)
  const max = hand.reduce((m, val) => {
    val = val.split('').sort((a, b) => a.charCodeAt(0) - b.charCodeAt(0)).join('')
    strength = str(val)
    if (strength > m) {
      return strength
    }
    return m
  }, 0)
  return max
}

function str(val) {
  if (val.match(/(.)\1{4}/)) {
    // 5x
    return 6
  }
  else if (val.match(/.*(.)\1{3}.*/)) {
    // 4x
    return 5
  }
  else if (val.match(/(.)\1{2}(.)\2{1}/) || val.match(/(.)\1{1}(.)\2{2}/)) {
    // 3x + 2x
    return 4
  }
  else if (val.match(/(.)\1{2}/)) {
    // 3x
    return 3
  }
  else if (val.match(/(.)\1{1}.*(.)\2{1}/)) {
    // 2x + 2x
    return 2
  }
  else if (val.match(/(.)\1{1}/)) {
    // 2x
    return 1
  }
  return 0
}

function replaceJs(hand) {
  return hand.replace(/(?<a>.*)J(?<b>.*)/,
  `$<a>A$<b>
$<a>K$<b>
$<a>Q$<b>
$<a>T$<b>
$<a>9$<b>
$<a>8$<b>
$<a>7$<b>
$<a>6$<b>
$<a>5$<b>
$<a>4$<b>
$<a>3$<b>
$<a>2$<b>`)
  .split('\n')
  .flatMap(h => h.includes('J') ? replaceJs(h) : h)
}



function findWorst(a, b) {
  a = a.split(' ')[0]
  b = b.split(' ')[0]

  let i = 0
  while (i < 5) {
    let sa = sorted.indexOf(a[i])
    let sb = sorted.indexOf(b[i])
    if (sa != sb) {
      return sb - sa
    }
    i++
  }
}

hands.forEach((h, i) => {
  res += +(h.split(' ')[1]) * (i + 1)
})

console.log(res)