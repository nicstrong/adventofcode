import { readLines } from "../util/util.js"

export async function day1iter() {
    var data = await readLines('data/2022/day1.in')

    let totals = []
    let current = 0


    for (let i = 0; i < data.length; i++) {
        if (data[i] === "") {
            totals.push(current)
            current = 0
        } else {
            current += parseInt(data[i]!)
        }
    }

    totals.sort((a, b) => b - a)
    console.log(`Top1: ${totals[0]}`)
    console.log(`Top3: ${totals[0]} + ${totals[1]} + ${totals[2]} = ${totals[0]! + totals[1]! + totals[2]!}`)
}


export async function day1() {
    var data = await readLines('data/day1.data')

    const totals = data
        .reduce((acc, cur) => {
            if (cur === "") {
                return [...acc, 0]
            }
            const updated = acc[acc.length - 1]! + parseInt(cur)
            return [...acc.slice(0, -1), updated]
        }, [0])
        .sort((a, b) => b - a)


    console.log(`Top1: ${totals[0]}`)
    console.log(`Top3: ${totals[0]} + ${totals[1]} + ${totals[2]} = ${totals[0]! + totals[1]! + totals[2]!}`)
}

