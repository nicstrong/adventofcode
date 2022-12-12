import seqitr from '../util/seqitr.js'
import { readAocData } from '../util/util.js'

type Symbol = 'E' | 'S'
    | 'a' | 'b' | 'c' | 'd' | 'f' | 'g' | 'h' | 'i' | 'j' | 'k' | 'l' | 'm'
    | 'n' | 'o' | 'p' | 'q' | 'r' | 's' | 't' | 'u' | 'v' | 'w' | 'x' | 'y' | 'z'
type CoordKey = string
type Elevation = Exclude<Symbol, 'E' | 'S'>
type Poi = readonly [Symbol, Elevation, number]
type Coord = readonly [number, number]
const DATA_FILE = 'data/2022/day12.in'
export async function day12() {

    const part1 = seqitr(await getPois())
        .first(x => x[1][0] === 'S')
    console.log(`Part1: ${JSON.stringify(part1)}`)

    const part2 = seqitr(await getPois())
        .filter(x => x[1][0] === 'a')
        .map(x => x[1][2])
        .reduce((acc, x) => x < acc ? x : acc, Number.MAX_SAFE_INTEGER)
        
    console.log(`Part2: ${part2}`)

}

async function getPois() {
    var data = await readAocData(DATA_FILE)

    const matrix = data.getTokens('')
    const elevations = seqitr(matrix)
        .flatMap((row, r) => row.map((col, c) => [c, r, col as Symbol] as const))
        .toMap<CoordKey, Symbol>(x => toKey([x[0], x[1]]), x => x[2])
    const goal = seqitr(elevations).first(x => elevations.get(x[0]) === 'E')!
    const N = matrix[0]!.length
    const M = matrix.length
    console.log(`${N}x${M}: Goal=${JSON.stringify(goal[0])}`)

    const pois = new Map<CoordKey, Poi>()
    pois.set(goal[0], ['E', elevation(goal[1]), 0])

    const queue = [goal[0]]
    while (queue.length > 0) {
        const coord = queue.shift()!
        const [x, y] = toCoord(coord)
        const distance = pois.get(coord)![2]

        const neighbors = [
            [x - 1, y] as const,
            [x + 1, y] as const,
            [x, y - 1] as const,
            [x, y + 1] as const,
        ].map<CoordKey>(c => toKey(c))

        for (const neighbor of neighbors) {
            const neighborSym = elevations.get(neighbor)
            if (neighborSym === undefined) {
                continue
            }
            const neighborElev = elevation(neighborSym)

            if (!pois.has(neighbor) && pois.get(coord)![1].charCodeAt(0) - neighborElev.charCodeAt(0) <= 1) {
                pois.set(neighbor, [neighborSym, neighborElev, distance + 1])
                queue.push(neighbor)
            }
        }
    }
    return pois
}

function elevation(sym: Symbol): Elevation {
    return sym === 'S' ? 'a' : sym === 'E' ? 'z' : sym
}
function toKey(coord: readonly [number, number]): CoordKey {
    return `${coord[0]}:${coord[1]}`
}
function toCoord(key: CoordKey): Coord {
    const res = key.split(':')!.map(x => parseInt(x))
    return [res[0]!, res[1]!] as const
}