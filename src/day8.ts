import { readLines } from './util/util.js'

export async function day8() {
    var data = await readLines('data/day8.data')

    const map = treeMap(data)
    const transposedMap = transpose(map)

    const visible = countVisible(map, transposedMap)
    console.log(`Part 1: ${visible}`)

    const scenicScores = getScenicScores(map, transposedMap)

    // for (let row of scenicScores) {
    //     console.log(`${JSON.stringify(row)}}`)
    // }

    const max = scenicScores
        .map(row => Math.max(...row))
        .reduce((acc, v) => Math.max(acc, v), -Infinity)
    console.log(`Part 2: ${max}`)

}

type ScenicScore = { l: number, r: number, t: number, b: number }

function getScenicScores(map: number[][], transposedMap: number[][]): number[][] {
    let scores: ScenicScore[][] = Array(map.length).fill(0).map(() => Array(map[0]!.length).fill({ l: 0, r: 0, t: 0, b: 0 }))

    score(map, scores, false)
    score(transposedMap, scores, true)

    return scores.map((row) => row.map((s) => s.l * s.r * s.t * s.b))

    function score(map: number[][], scores: ScenicScore[][], transpose: boolean) {
        for (let i = 1; i < map.length - 1; i++) {
            for (let j = 1; j < map[i]!.length - 1; j++) {
                const r = transpose ? j : i
                const c = transpose ? i : j
                const s = scores[r]![c]!
                const left = scoreLeft(map[i]!, j)
                const right = scoreRight(map[i]!, j)
                if (transpose) {
                    scores[r]![c] = { ...s, t: left, b: right }

                } else {
                    scores[r]![c] = { ...s, l: left, r: right }
                }
            }
        }
    }

    function scoreLeft(row: number[], idx: number): number {
        let score = 0
        for (let i = idx - 1; i >= 0; --i) {
            if (row[i]! >= row[idx]!) {
                return score + 1
            }
            score++
        }
        return score
    }
    function scoreRight(row: number[], idx: number): number {
        let score = 0
        for (let i = idx + 1; i < row.length; ++i) {
            if (row[i]! >= row[idx]!) {
                return score + 1
            }
            score++
        }
        return score
    }

}

function countVisible(map: number[][], transposedMap: number[][]): number {

    const outer = (map.length - 1) * 4
    const [inner1, found] = count(map, [])
    const [inner2,] = count(transposedMap, found)

    console.log(`outer: ${outer}, innerRows: ${inner1}, innerCols: ${inner2}`)

    return inner1 + inner2 + outer

    function count(map: number[][], foundAlready: string[]): readonly [number, string[]] {
        let vis = 0
        const found: string[] = []
        for (let i = 1; i < map.length - 1; i++) {
            //console.log(`row[${i}]: ${JSON.stringify(map[i])}`)
            for (let j = 1; j < map[i]!.length - 1; j++) {
                if (foundAlready.some((p) => p === `${j},${i}`)) {
                    continue
                }
                if (allBeforeVisible(map[i]!, j)) {
                    found.push(`${i},${j}`)
                    //console.log(`allBeforeVisible(${map[i]![j]}): ${i}, ${j}`)
                    vis++
                } else {
                    if (allVisibleAfter(map[i]!, j)) {
                        found.push(`${i},${j}`)
                        //console.log(`allVisibleAfter(${map[i]![j]}): ${i}, ${j}`)
                        vis++
                    }
                }
            }
        }
        return [vis, found] as const
    }
    function allBeforeVisible(row: number[], idx: number): boolean {
        for (let i = idx - 1; i >= 0; --i) {
            if (row[i]! >= row[idx]!) {
                return false
            }
        }
        return true
    }
    function allVisibleAfter(row: number[], idx: number): boolean {
        for (let i = idx + 1; i < row.length; ++i) {
            if (row[i]! >= row[idx]!) {
                return false
            }
        }
        return true
    }
}





function treeMap(data: string[]): number[][] {
    const res = data
        .map(row => [...row])
        .map(row => row.map(i => parseInt(i)))
    return res
}


function transpose(trees: number[][]): number[][] {
    const result = trees[0]!.map((_, i) => trees.map(row => row[i]!))
    return result
}
