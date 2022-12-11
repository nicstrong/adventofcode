import { readAocData } from '../util/util.js'

type Monkey = {
    items: number[]
    operation: readonly [string, number | null]
    testDivisor: number
    trueMonkey: number
    falseMonkey: number
    inspected: number
}

export async function day11() {
    const part1 = await getData()
    let mod = part1.reduce((a, c) => a*c.testDivisor, 1);

    for (let round = 0; round < 20; ++round) {
        for (let i = 0; i < part1.length; ++i) {
            iteration(i, part1, false, mod)
        }
    }
    for (let i = 0; i < part1.length; ++i) {
        console.log(`Monkey ${i} inspected items ${part1[i]!.inspected} times`)
    }
    const count1 = part1.map(x => x.inspected).sort((a, b) => b - a)
    console.log(`Part 1: ${count1[0]! * count1[1]!}`)


    const part2 = await getData()
    for (let round = 0; round < 10000; ++round) {
        for (let i = 0; i < part2.length; ++i) {
            iteration(i, part2, true,  mod)
        }
        // if ((round % 999 === 0 || round === 19)) {
        //     console.log(`== After round ${round + 1} ==`)
        //     for (let i = 0; i < part2.length; ++i) {
        //         console.log(`Monkey ${i} inspected items ${part2[i]!.inspected} times`)
        //     }
        // }
    }

    const count = part2.map(x => x.inspected).sort((a, b) => b - a)
    console.log(`Part 1: ${count[0]! * count[1]!}`)
}

function iteration(index: number, monkies: Monkey[], part2: boolean, mod: number) {
    const monkey = monkies[index]!
    for (let item of monkey.items) {
        monkey.inspected++
        let op = exec(monkey.operation, item)
        let newItem: number = 0
        if (!part2)
            newItem = Math.floor((op % mod) / 3)
        else
            newItem = op % mod
        const throwIndex = (newItem % monkey.testDivisor === 0) ? monkey.trueMonkey : monkey.falseMonkey
        monkies[throwIndex]!.items.push(newItem)
    }
    monkey.items = []
}

function exec(op: readonly [string, number | null], old: number): number {
    const value = op[1] ? op[1] : old
    let res: number = 0
    if (op[0] === '+') {
        res = old + value
    } else {
        res = old * value
    }
    //console.log(`op ${op[0]} ${value} on ${old} = ${res}`)
    return res
}

function parseOp(op: string): readonly [string, number | null] {
    const parts = op.substring(10).split(' ')
    const num = parseInt(parts[1]!)
    return [parts[0]!, isNaN(num) ? null : num]
}

async function getData() {
    var data = await readAocData('data/2022/day11.in')

    let initial: Monkey[] = []
    for (let i = 0; i < data.lines.length; i += 7) {
        const monkey: Monkey = {
            items: data.lines[i + 1]!.split(':')[1]!.split(', ').map(x => parseInt(x)),
            operation: parseOp(data.lines[i + 2]!.split(': ')[1]!),
            testDivisor: parseInt(data.lines[i + 3]!.substring(21)),
            trueMonkey: parseInt(data.lines[i + 4]!.substring(28)),
            falseMonkey: parseInt(data.lines[i + 5]!.substring(29)),
            inspected: 0
        }
        initial.push(monkey)
    }
    return initial
}