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

    let oxygen = [...lines]
    let bit = 0
    const oxygenFilter = (x: string, b: number, hi: number, lo: number) => x[b] === (hi >= lo ? '1' : '0')
    while (oxygen.length > 1) {
        oxygen = pass(oxygen, bit++, oxygenFilter)
    }
    console.log(`oxygen: ${oxygen[0]!}`)
    console.log(`oxygen: ${parseInt(oxygen[0]!, 2)}`)

    let co2 = [...lines]
    bit = 0
    const co2Filter = (x: string, b: number, hi: number, lo: number) => x[b] === (lo <= hi ? '0' : '1')
    while (co2.length > 1) {
        co2 = pass(co2, bit++, co2Filter)
    }
    console.log(`co2: ${co2[0]!}`)
    console.log(`co2: ${parseInt(co2[0]!, 2)}`)
    console.log(`life support rating: ${parseInt(oxygen[0]!, 2) * parseInt(co2[0]!, 2)}`)
}

function pass(numbers: string[], bit: number, f: (x: string, b: number, hi: number, lo: number) => boolean): string[] {
    let hi = 0
    let lo = 0
    for (let i = 0; i < numbers.length; i++) {
        if (numbers[i]![bit] === '1') {
            hi++
        } else {
            lo++
        }
    }
    const res = numbers.filter(x => f(x, bit, hi, lo))
    return res
}

