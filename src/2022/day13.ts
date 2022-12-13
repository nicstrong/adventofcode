import { readAocData } from '../util/util.js'

const DATA_FILE = 'data/2022/day13.in'

export async function day13() {
    const input = await getInputPart1()

    let inOrder: number[] = []
    for (let i = 0; i < input.length; i++) {
        const pair = input[i]!
        const [a, b] = pair
        const result = compare(a, b)
        if (result) {
            inOrder.push(i + 1)
        }
    }
    console.log(`Part 1: ${inOrder.reduce((acc, x) => acc + x, 0)}`)

    const divider1 = [[2]]
    const divider2 = [[6]]
    const part2 = await getInputPart2()
    const markers = [...part2, divider1, divider2]
    const sorted = markers.sort((a, b) => {
        const res = compare(a, b)
        if (res === null) {
            0
        }
        return res ? -1 : 1
    })
    const marker1 = sorted.indexOf(divider1) + 1
    const marker2 = sorted.indexOf(divider2) + 1
    console.log(`Part 2: ${marker1 * marker2}`)
}

function compare(a: Packet, b: Packet): boolean | null {

    for (let i = 0; i < a.length; i++) {
        const aVal = a[i]!
        const bVal = b[i]!
        //console.log(`Comparing ${JSON.stringify(aVal)} and ${JSON.stringify(bVal)}: ${typeof aVal} and ${typeof bVal}`)
        if (aVal !== undefined && bVal === undefined) {
            return false
        }
        if (typeof aVal === 'number' && typeof bVal === 'number') {
            if (aVal > bVal) {
                return false
            } else if (aVal < bVal) {
                return true
            }
        } else if (typeof aVal === 'object' && typeof bVal === 'object') {
            const res = compare(aVal, bVal)
            if (res !== null) {
                return res
            }
        } else if (typeof aVal === 'number' && typeof bVal === 'object') {
            const res = compare([aVal], bVal)
            if (res !== null) {
                return res
            }
        } else if (typeof aVal === 'object' && typeof bVal === 'number') {
            const res = compare(aVal, [bVal])
            if (res !== null) {
                return res
            }
        }
    }
    return a.length < b.length ? true : a.length === b.length ? null : false
}

type Packet = (number | Packet)[]
type Pair = readonly [Packet, Packet]


async function getInputPart1() {

    var data = await readAocData(DATA_FILE)

    const input = data.lines
        .map(line => eval(line))

    let pairs: Pair[] = []
    for (let i = 0; i <= input.length; i++) {
        if (!input[i]) {
            pairs.push([input[i - 2], input[i - 1]])
        }
    }
    return pairs
}


async function getInputPart2() {

    var data = await readAocData(DATA_FILE)

    const input = data.lines
        .map(line => eval(line))
        .filter(x => x !== undefined)
    return input
}

