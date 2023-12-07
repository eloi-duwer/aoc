const fs = require('fs')

let [time, distance] = fs.readFileSync('input').toString('utf-8').split('\n')

times = time.split(' ').map(n => +n)
distances = distance.split(' ').map(n => +n)

let res = 1

times.forEach((time, i) => {
  const distance = distances[i]
  let nOver = 0
  let timePress = 0

  while (timePress <= time) {

    // if (timePress % 1000000 === 0) {
    //   console.log(`${timePress} / ${time}`)
    // }

    const timeRun = time - timePress
    if (timeRun * timePress > distance) {
      nOver++
    }
    timePress++
  }

  res *= nOver

})

console.log(res)