import { readAocData } from "../util/util.js";

export async function day1() {
    const data = await readAocData('data/2021/day1.in')
    const readings = data.lines.map(x => parseInt(x))
    const increases = readings.reduce((acc, x, idx) => acc + (idx > 0 ? x > readings[idx - 1]! ? 1 : 0 : 0), 0)
    console.log(`Part 1: ${increases}`)


    let prev: number | null = null
    let inc = 0
    for (let i = 0; i < readings.length - 2; ++i) {
        const val = readings[i]! + readings[i + 1]! + readings[i + 2]!
        if (prev !== null && val > prev) {
            inc++
        }
        prev = val
    }
    console.log(`Part 2: ${inc}`)

}