import { readLines } from '../util/util.js'

export async function day5() {
    var data = await readLines('data/2022/day5.in')

    let stacks = getStacks(data)
    const moves = getMoves(data)

    //console.log('Iniitial:', stacks)

    for (const move of moves) {
    stacks = applyMove(move, stacks)
    }

    // stacks = applyMove(moves[0]!, stacks)
    // console.log('Stacks:', stacks)

    const top = stacks.reduce((acc, stack) => acc + stack[stack.length - 1], '')
    console.log(`Top ${top}`)
}

// function applyMovePart1(move: readonly [number, number, number], stacks: Stacks): Stacks {
//     for (let i = 0; i < move[0]; ++i) {
//         const item = stacks[move[1]]!.pop()!
//         stacks[move[2]]!.push(item)
//     }
//     return stacks
// }

function applyMove(move: readonly [number, number, number], stacks: Stacks): Stacks {
    let moveItems: string[] = []
    for (let i = 0; i < move[0]; ++i) {
        const item = stacks[move[1]]!.pop()!
        moveItems.unshift(item)
    }
    stacks[move[2]]!.push(...moveItems)
    return stacks
}

type Stacks = readonly [string[], string[], string[], string[], string[], string[], string[], string[], string[]]
function getStacks(data: string[]): Stacks {
    let idx = 0
    let result = [[] as string[], [] as string[], [] as string[], [] as string[], [] as string[], [] as string[], [] as string[], [] as string[], [] as string[]] as const
    while (true) {
        const l = data[idx++]
        if (!l || l.length !== 35 || l === ' 1   2   3   4   5   6   7   8   9 ') break;
        for (let i = 0; i < 9; ++i) {
            const token = l.substring(i * 4, i * 4 + 3)
            if (token[0]! === '[' && token[2]! === ']') {
                result[i]!.unshift(token[1]!)
            }
        }
    }
    return result
}

function getMoves(data: string[]): (readonly [number, number, number])[] {
    const results: (readonly [number, number, number])[] = []
    for (let i = 10; i < data.length; ++i) {
        const tokens = data[i]?.split(' ')
        if (!tokens || tokens.length !== 6) throw new Error('Bad move line')
        results.push([parseInt(tokens[1]!), parseInt(tokens[3]!) - 1, parseInt(tokens[5]!) - 1] as const)
    }
    return results
}




