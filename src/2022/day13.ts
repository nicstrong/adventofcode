import seqitr from 'seqitr'
import { readAocData } from '../util/util.js'

const DATA_FILE = 'data/2022/day13.in'

export async function day13() {
    const input = await getInputPart1()


    const part1 = (await getInputPart1())
                    .map((x, i) => [i + 1, compare(x[0], x[1])] as const)
                    .filter(x => x[1] < 0)
                    .reduce((acc, x) => acc + x[0], 0)
    console.log(`Part 1: ${part1}`)

    const divider1 = [[2]]
    const divider2 = [[6]]
    const part2 = (await getInputPart2())
                    .concat([divider1, divider2])
                    .sort(compare)
    const marker1 = part2.indexOf(divider1) + 1
    const marker2 = part2.indexOf(divider2) + 1
    console.log(`Part 2: ${marker1 * marker2}`)
}

function compare(a: Packet, b: Packet): number {

    for (let i = 0; i < a.length; i++) {
        const aVal = a[i]!
        const bVal = b[i]!
        //console.log(`Comparing ${JSON.stringify(aVal)} and ${JSON.stringify(bVal)}`)
        if (aVal !== undefined && bVal === undefined) {
            return 1
        }
        if (isNumber(aVal) && isNumber(bVal)) {
            if (aVal > bVal) {
                return 1
            } else if (aVal < bVal) {
                return -1
            }
        } else if (isPacket(aVal) && isPacket(bVal)) {
            const res = compare(aVal, bVal)
            if (res !== 0) {
                return res
            }
        } else if (isNumber(aVal) && isPacket(bVal)) {
            const res = compare([aVal], bVal)
            if (res !== 0) {
                return res
            }
        } else if (isPacket(aVal) && isNumber(bVal)) {
            const res = compare(aVal, [bVal])
            if (res !== 0) {
                return res
            }
        }
    }
    return a.length < b.length ? -1 : a.length === b.length ? 0 : 1
}

type Packet = (number | Packet)[]
type Pair = readonly [Packet, Packet]

function isPacket(x: number|Packet): x is Packet {
    return Array.isArray(x)
}

function isNumber(x: number|Packet): x is number {
    return typeof x === 'number'
}


async function getInputPart1() {

    var data = await readAocData(DATA_FILE)

    const input = seqitr(data.lines)
        .map(line => eval(line) as Packet)
        .chunk(2)
        .map(x => [x[0]!, x[1]!] as const)
        .toArray()

    return input
}


async function getInputPart2() {

    var data = await readAocData(DATA_FILE)

    const input = data.lines
        .map(line => eval(line))
        .filter(x => x !== undefined)
    return input
}

