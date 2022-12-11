import { readAocData } from "../util/util.js"

export async function day3() {
    const data = await readAocData('data/2021/day3.in')
    const lines = data.lines
    const N = lines[0]!.length
    const M = lines.length

    let gamma = ''
    for (let j = 0; j < N; j++) {
        let hi = 0
        let lo = 0
        for (let i = 0; i < M; i++) {
            if (lines[i]![j] === '1') {
                hi++
            } else {
                lo++
            }
        }
        gamma += (hi > lo ? '1' : '0')
    }
    console.log('gamma: ' + parseInt(gamma, 2))

    const epsilon = [...gamma].reduce((acc, x) => acc + (x === '1' ? '0' : '1'), '')

    console.log('episilon: ' + parseInt(epsilon, 2))

    console.log(`power consumption: ${parseInt(gamma, 2) * parseInt(epsilon, 2)}`)
}