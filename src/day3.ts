import { readLines } from './util/util.js'

export async function day3() {
    var data = await readLines('data/day3.data')

    const scores = data
        .reduce((acc, l) => {
            const cur = acc[acc.length - 1]!
            cur.rucksacks.push(l)
            if (cur.rucksacks.length === 3) {
                return [...acc, { index: cur.index + 1, rucksacks: [] as string[] }]
            }
            return acc

        }, [{ index: 0, rucksacks: [] as string[] }])
        .filter(g => g.rucksacks.length > 0)
        .map(g => {
            const com = commonItem(g.rucksacks)
            return [com, pri(com)] as const
        })

    const sum = scores.reduce((acc, g) => acc + g[1]!, 0)

    console.log(`Sum: ${sum}`)
}

function commonItem(row: string[]): string {
    if (row.length !== 3) throw new Error('Group size should be 3')
    let com: string[] = []
    for (let i = 0; i < row[0]!.length ; i++) {
        const item = row[0]!.charAt(i)
        if (row[1]!.indexOf(item) > -1 && !com.some(x => x === item)
            && row[2]!.indexOf(item) > -1 && !com.some(x => x === item)) {
            com.push(item)
        }
    }
    if (com.length === 0) throw Error(`Should be 1 common item: [${row.join(', ')}]`)
    if (com.length !== 1) throw Error(`Should only be 1 common item: [${com.join(', ')}]`)
    return com[0]!
}

export async function part1() {
    var data = await readLines('data/day3.data')

    const packs = data
        .map(l => {
            const splitAt = l.length / 2
            return [l.substring(0, splitAt), l.substring(splitAt)] as const
        })
        .map((compartments, i) => {
            if (compartments[0].length !== compartments[1].length) {
                throw Error(`Should only be have same amount of items in each compartment (${i + 1}) c1=${compartments[0].length}, c2=${compartments[1].length}}`)
            }
            const c = common(compartments[0], compartments[1])
            return [compartments[0], compartments[1], c!, pri(c!)] as const
        })


    const sum = packs.reduce((acc, p) => acc + p[3], 0)
    console.log("Total", sum)
}

function pri(item: string) {
    if (item.toUpperCase() === item) {
        return item.charCodeAt(0) - 38
    }
    return item.charCodeAt(0) - 96
}

function common(s1: string, s2: string) {
    let com: string[] = []
    for (let i = 0; i < s1.length; i++) {
        const item = s1.charAt(i)
        if (s2.indexOf(item) > -1 && !com.some(x => x === item)) {
            const item = s1.charAt(i)
            com.push(item)
        }
    }
    if (com.length !== 1) throw Error('Should only be 1 common item')
    return com[0]
}
