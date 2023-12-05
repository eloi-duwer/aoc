const fs = require('fs')

const monkeyStrings = fs.readFileSync('./input').toString('utf-8').split('\n\n')

const nRounds = 10000
const nMaxToFind = 2

class Monkey {
	constructor (monkeyString, i) {
		this.index = i

		let [_monkeyNum, items, operation, test, ifTrue, ifFalse] = monkeyString.split('\n')

		this.items = items.slice('  Starting items: '.length).split(', ').map(i => BigInt(i))
		this.operation = 'item' + operation.slice('  Operation: '.length).replace(/(\d+)/, 'BigInt($1)')
		this.test = BigInt(test.slice('  Test: divisible by '.length))
		this.ifTrue = +ifTrue.slice('    If true: throw to monkey '.length)
		this.ifFalse = +ifFalse.slice('    If false: throw to monkey '.length)
		this.nInspected = 0
		this.maxModulo = 0
	}

	inspectAndThrowItems() {
		const ret = []
		while (this.items.length > 0) {
			const old = BigInt(this.items.shift())
			let itemnew
			eval(this.operation)
			itemnew = itemnew % this.maxModulo
			this.nInspected++
			if (itemnew % this.test === BigInt(0)) {
				ret.push({
					to: this.ifTrue,
					item: itemnew
				})
			} else {
				ret.push({
					to: this.ifFalse,
					item: itemnew
				})
			}
		}
		return ret
	}

	addItem(item) {
		this.items.push(item)
	}
}

const monkeys = monkeyStrings.map((mDef, i) => new Monkey(mDef, i))

const maxModulo = monkeys.reduce((acc, val) => acc * val.test, BigInt(1))
monkeys.forEach(m => m.maxModulo = maxModulo)

console.log(maxModulo)

let i = 0
while (i < nRounds) {
	monkeys.forEach(m => {
		const moves = m.inspectAndThrowItems()
		moves.forEach(({to, item}) => {
			monkeys[to].addItem(item)
		})
	})
	console.log(`Round ${i}`)
	i++;
}

const nInspected = monkeys.map(m => m.nInspected).sort((a, b) => {
	if (a < b) return 1
	else if (a > b) return -1
	return 0
})
console.log(nInspected)

const biznessLevel = nInspected
	.slice(0, nMaxToFind)
	.reduce((acc, val) => BigInt(acc) * BigInt(val), BigInt(1))

console.log(biznessLevel)