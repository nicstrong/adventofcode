import { readLines } from './util/util.js'

export async function day4() {
    var data = await readLines('data/day4.data')

    const scores = data
        .map(r => {
            const pair = r.split(',')
            if (pair.length !== 2) throw new Error('Missing pair in row')
            return [range(pair[0]!), range(pair[1]!)] as const
        })
        .map(r => [r[0], r[1], overlaps(r[0], r[1])] as const)

    scores.forEach(r => console.log(`[${r[0][0]}-${r[0][1]}}] : [${r[1][0]}-${r[1][1]}}] - ${r[2]}`))
    const total = scores.reduce((acc, r) => acc + (r[2] ? 1 : 0), 0)
    console.log(`Total: ${total}`)
}

export async function part1() {
    var data = await readLines('data/day4.data')

    const scores = data
        .map(r => {
            const pair = r.split(',')
            if (pair.length !== 2) throw new Error('Missing pair in row')
            return [range(pair[0]!), range(pair[1]!)] as const
        })
        .map(r => [r[0], r[1], contains(r[0], r[1]) || contains(r[1], r[0])] as const)

    // scores.forEach(r => console.log(`[${r[0][0]}-${r[0][1]}}] : [${r[1][0]}-${r[1][1]}}] - ${r[2]}`))
    const total = scores.reduce((acc, r) => acc + (r[2] ? 1 : 0), 0)
    console.log(`Total: ${total}`)
}

function range(inp: string): [number, number] {
    const s = inp.split('-')
    return [parseInt(s[0]!), parseInt(s[1]!)]
}

function contains(r1: [number, number], r2: [number, number]) {
    return r1[0] <= r2[0] && r1[1] >= r2[1]
}

function overlaps(r1: [number, number], r2: [number, number]) {
    return r1[0] <= r2[1] && r1[1] >= r2[0]

}