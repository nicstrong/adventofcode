import { readAocData } from "../util/util.js";

type Dir = 'forward' | 'up' | 'down'
export async function day2() {
    const data = await readAocData('data/2021/day2.in')
    const readings = data.getTokens(' ').map<readonly [Dir, number]>(x => [x[0]! as Dir, parseInt(x[1]!)] as const)

    const pos: readonly [number, number] = [0, 0] as const
    const finalPos = readings.reduce((acc, [dir, amt]) => move(dir, amt, acc), pos)
    console.log('Part 1: ' + finalPos[0] * finalPos[1])


    const pos2: readonly [number, number, number] = [0, 0, 0] as const
    const finalPos2 = readings.reduce((acc, [dir, amt]) => move2(dir, amt, acc), pos2)
    console.log('Part 2: ' + JSON.stringify(finalPos2))
    console.log('Part 2: ' + finalPos2[0] * finalPos2[1])
}

function move(dir: Dir, amt: number, pos: readonly [number, number]): readonly [number, number] {
    const [x, y] = pos
    switch (dir) {
        case 'forward': return [x + amt, y]
        case 'up': return [x, y - amt]
        case 'down': return [x, y + amt]
    }
}

function move2(dir: Dir, amt: number, pos: readonly [number, number, number]): readonly [number, number, number] {
    const [horiz, depth, aim] = pos
    switch (dir) {
        case 'forward': return [horiz + amt, depth + (aim * amt), aim]
        case 'up': return [horiz, depth, aim - amt]
        case 'down': return [horiz, depth, aim + amt]
    }
}