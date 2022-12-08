import { readLines } from '../util/util.js'

export async function day4() {
    var data = await readLines('data/2022/day4.in')

    const scores = data
        .map(r => {
            const pair = r.split(',')
            if (pair.length !== 2) throw new Error('Missing pair in row')
            return [range(pair[0]!), range(pair[1]!)] as const
        })
        .map(r => [r[0], r[1], overlaps(r[0], r[1])] as const)

    const minMax = scores.reduce((acc, r) => {
        if (r[0][0] < acc[0]!) {
            acc = [r[0][0], acc[1]!]
        }
        if (r[1][0] < acc[0]!) {
            acc = [r[1][0], acc[1]!]
        }
        if (r[0][1] > acc[1]!) {
            acc = [acc[0]!, r[0][1]]
        }
        if (r[1][1] > acc[1]!) {
            acc = [acc[0]!, r[1][1]]
        }
        return acc
    }, [1000, -1] )

    scores.forEach(r => visualise(r, minMax as [number, number]))

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

/*
.234.....  2-4
.....678.  6-8
*/
function visualise(row: readonly [readonly [number, number], readonly [number, number], boolean], minMax: [number, number]) {
    function getRow(range: readonly[number, number], minMax: [number, number]) {
        let str = ''
        for (let i = 0; i < minMax[1] - 1; ++i) {
            if (i >= (range[0] - 1) && i <= (range[1] - 1)) {
                str = str + (i + 1).toString()
            } else {
                str = str + (i > 9 ? '..' : '.')
            }
        }
        return str
    }
    console.log(`${getRow(row[0], minMax)}  ${row[0][0]}-${row[0][1]}`)
    console.log(`${getRow(row[1], minMax)}  ${row[1][0]}-${row[1][1]}`)
    console.log()
}

