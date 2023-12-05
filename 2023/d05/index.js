const fs = require('fs')

const file = fs.readFileSync('test').toString('utf-8')

let [seeds, ...steps] = file.replaceAll(/.*:/g, '').split('\n\n\n').map(s => s.trim().split('\n'))

seeds = parseSeeds(seeds[0].split(' ').map(s => +s))
steps = steps.map((step, i) => step.map(s => s.split(' ').map(n => +n)).map(s => ({
  destination: s[0],
  source: s[1],
  range: s[2],
  sourceEnd: s[1] + s[2] - 1,
  offset: s[1] - s[0],
  index: i
})))

const length = steps.length
console.log(length)
console.log(steps)

while (seeds.length) {
  seed = seeds.shift()

  const currentSteps = steps[seed.step]
  let intersect = 'NONE'
  currentSteps.find(s => {
    const i = rangeIntersect(seed, s)
    if (i != 'NONE') {
      intersect = i
      return true
    }
    return false
  })
  if (intersect === 'NONE') {
    // No intersections, go to next step with same range
    seed.step++
  }
  if (intersect === 'INSIDE') {
    // Seeds are in the whole range, map all of them
    seed.seed -= step.offset
    seed.step++
  }
  if (intersect === 'END') {
    // Only the end of the range is matching, map the matching part, create a new range for the missing part
    splitEnd(seed, step)
    seed.seed = step.source
    seed.step++
  }

  if (seed.step === length) {
    finishedRanges.push(seed)
  } else {
    seeds.push(seed)
  }
}

function splitEnd(seed, step) {
  const newRange = step.source - seed.seed
    if (newRange > 0) {
      const newSeed = {
          seed: seed.seed,
          range: newRange,
          seedEnd: seed.seed + newRange - 1,
          step: seed.step
      }
      seeds.push(newSeed)
    }
}

function splitStart(seed, step) {
  const newRange = step.source - seed.seed
    if (newRange > 0) {
      const newSeed = {
          seed: seed.seed,
          range: newRange,
          seedEnd: seed.seed + newRange - 1,
          step: seed.step
      }
      seeds.push(newSeed)
    }
}

const finishedRanges = []

/*
seed         seedEnd
  #------------#
     #---------------#
  source         sourceEnd

  There can be intersections at the START, END of the seed,
  the seed could be AROUND the range, INSIDE or NONE.
  In this example its END, meaning the start needs to be splitted + reran
*/
function rangeIntersect(seed, range) {
  // Seed start is beween source start and end
  if (seed.seed >= range.source && seed.seed <= range.sourceEnd) {
    if (seed.seedEnd <= range.sourceEnd) {
      return "INSIDE"
    }
    return "STsourceEndART"
  }
  if (seed.seedEnd >= range.source && seed.seedEnd <= range.sourceEnd) {
    return "END" // The INSIDE case has already be covered
  }
  if (seed.seed <= range.source && seed.seedEnd >= range.sourceEnd) {
    return "AROUND"
  }
  return "NONE"
}

function parseSeeds(seeds) {
  const res = []
  for (let i = 0; i < seeds.length; i += 2) {
    res.push({
      seed: seeds[i],
      range: seeds[i + 1],
      seedEnd: seeds[i] + seeds[i + 1] - 1,
      step: 0
    })
  }
  return res
}

// const soils = seeds.map(seed => {
//   for (step of steps) {
//     seed = mutateSeed(seed, step)
//   }
//   return seed
// })

// soils.sort((a, b) => a.seed - b.seed)
// console.log(soils)

// function mutateSeed(seed, step) {
//   const found = step.find(s => seed.seed >= s.source && seed.seed < s.sourceEnd)
//   console.log(seed, step, found)
//   if (found != null) {
//     seed.seed = seed.seed - found.offset
//   }
//   return seed
// }