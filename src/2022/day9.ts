import { readAocData } from '../util/util.js'

export async function day9() {
    var data = await readAocData('data/2022/day9.in')

    const moves = data
        .getTokens(' ')
        .map(line => [line[0]! as Direction, parseInt(line[1]!)] as const)


    let origin = [0, 0] as const
    const positions = playHeadOnly(moves, origin)
    console.log(`Positions: ${JSON.stringify(positions)}`)
    const indicies = positions.reduce<readonly [number, number, number, number]>((acc, pos) => {
        const m1 = Math.min(acc[0], pos[0])
        const m2 = Math.min(acc[1], pos[1])
        const M1 = Math.max(acc[2], pos[0])
        const M2 = Math.max(acc[3], pos[1])
        return [m1, m2, M1, M2] as const
    }, [0, 0, 0, 0] as const)
    console.log(`Indicies: ${JSON.stringify(indicies)}`)
    const max = [indicies[2] - indicies[0] + 1, indicies[3] - indicies[1] + 1] as const
    console.log(`max: ${JSON.stringify(max)}`)

    const visited: (readonly [number, number])[] = []
    const NUM_KNOTS = 10
    let knots = [...Array(10).keys()].map(_ => [0, 0] as const)
    console.log(`Knots: ${JSON.stringify(knots)}`)

    visitPart2(indicies, max, knots, moves, visited)
    showBoardVisited(indicies, max, visited)
    console.log(`Visted ${visited.length}`)
}

function visitPart2(_indicies: readonly [number, number, number, number], _max: readonly [number, number],
    knots: (readonly [number, number])[], moves: readonly (readonly [Direction, number])[], visited: (readonly [number, number])[]) {

    for (let i = 0; i < moves.length; i++) {
        const [dir, steps] = moves[i]!
        for (let j = 0; j < steps; j++) {
            knots[0] = moveHead(knots[0]!, dir, 1)
            for (let k = 1; k < knots.length; k++) {
                knots[k] = followHead(knots[k - 1]!, knots[k]!)
                if (k === knots.length - 1 && !visited.some(([x, y]) => x === knots[k]![0] && y === knots[k]![1])) {
                    visited.push(knots[k]!)
                }
            }

        }
        //showBoard(indicies, max, knots)
        //showBoardVisited(N, M, visited)
    }
}


// function visitPart1(indicies: readonly [number, number, number, number], max: readonly [number, number], originHead: readonly [number, number], orginTail: readonly [number, number], moves: readonly (readonly [Direction, number])[], visited: (readonly [number, number])[]) {
//     let curHead = originHead
//     let curTail = orginTail

//     for (let i = 0; i < moves.length; i++) {
//         const [dir, steps] = moves[i]!
//         // console.log(`Before move: ${dir}->${steps}: curHead: ${JSON.stringify(curHead)} curTail: ${JSON.stringify(curTail)}`)
//         for (let j = 0; j < steps; j++) {
//             curHead = moveHead(curHead, dir as Direction, 1)
//             curTail = followHead(curHead, curTail)
//             if (!visited.some(([x, y]) => x === curTail[0] && y === curTail[1])) {
//                 visited.push(curTail)
//             }
//         }
//         //showBoard(indicies, max, curHead, curTail)
//         //showBoardVisited(N, M, visited)
//     }
// }

type Direction = 'U' | 'D' | 'L' | 'R'

function isAdjacent(head: readonly [number, number], tail: readonly [number, number]) {
    const [hx, hy] = head
    const [tx, ty] = tail
    return (Math.abs(hx - tx) === 0 || Math.abs(hx - tx) === 1)
        && (Math.abs(hy - ty) === 0 || Math.abs(hy - ty) === 1)
}

function followHead(head: readonly [number, number], tail: readonly [number, number]) {
    const [hx, hy] = head
    let [tx, ty] = tail
    if (hx === tx && hy === ty) {
        return tail
    }
    if (isAdjacent(head, tail)) {
        return tail
    }
    if (ty > hy) {
        ty = ty - 1
    } else if (ty < hy) {
        ty = ty + 1
    }
    if (tx > hx) {
        tx = tx - 1
    } else if (tx < hx) {
        tx = tx + 1
    }
    return [tx, ty] as const
}

function playHeadOnly(moves: readonly (readonly [Direction, number])[], origin: readonly [number, number]) {
    const positions = [origin]
    let current = origin
    for (let i = 0; i < moves.length; i++) {
        const [dir, steps] = moves[i]!
        current = moveHead(current, dir as Direction, steps)
        positions.push(current)
    }
    return positions
}

function moveHead(current: readonly [number, number], dir: Direction, steps: number) {
    const [x, y] = current
    switch (dir) {
        case 'U': return [x, y + steps] as const
        case 'D': return [x, y - steps] as const
        case 'L': return [x - steps, y] as const
        case 'R': return [x + steps, y] as const
    }
}

function showBoard(indicies: readonly [number, number, number, number], max: readonly [number, number],
    knots: (readonly [number, number])[]) {
    const [N, M] = max
    const [mx, my, Mx, My] = indicies

    for (let row = My; row >= my; --row) {
        let rowStr = ''
        for (let col = mx; col <= Mx; ++col) {
            const found = knots
                .map((k, idx) => [idx, k[0] === col && k[1] === row] as const)
                .filter(([_, isMatch]) => isMatch)
            if (found.length > 0) {
                const firstIdx = found[0]![0]
                rowStr += firstIdx === 0 ? 'H' : firstIdx.toString()
            } else {
                if (col === 0 && row === 0)
                    rowStr += 's'
                else
                    rowStr += '.'
            }
        }
        console.log(rowStr)
    }
    console.log()
}

function showBoardVisited(indicies: readonly [number, number, number, number], max: readonly [number, number], visited: (readonly [number, number])[]) {
    const [N, M] = max
    const [mx, my, Mx, My] = indicies

    for (let row = My; row >= my; --row) {
        let rowStr = ''
        for (let col = mx; col <= Mx; ++col) {
            const [x, y] = [col, row]
            if (x === 0 && y === 0) {
                rowStr += 's'
            } else if (visited.some(([x1, y1]) => x === x1 && y === y1)) {
                rowStr += '#'
            } else {
                rowStr += '.'
            }
        }
        console.log(rowStr)
    }
    console.log()

}