import { readAocData } from "../util/util.js"

const DATA_FILE = 'data/2022/day15.in'
const Y = 2_000_000
const Y_MAX = 4_000_000
const FREQ = 56000011

type Coord = { x: number, y: number }
type Sensor = {
    sensor: Coord
    beacon: Coord
    dist: number
}
type SensorMap = {
    data: Sensor[]
    bounds: readonly [number, number, number, number, number]
}
export async function day15() {
    const inp = await getInput()

    //inp.data.forEach(({ sensor: s, beacon: b, dist }) => console.log(`s: ${JSON.stringify(s)}, b: ${JSON.stringify(b)}, d: ${dist}`))
    const available = getAvailable(inp, Y)
    console.log(`Part 1: ${available}`)
}

function getAvailable(censorMap: SensorMap, y: number): number {
    const [minX, minY, maxX, maxY, maxRange] = censorMap.bounds
    let available = 0

    for (let x = minX - maxRange * 2; x <= maxX + maxRange * 2; x++) {
        for (const { sensor: { x: sx, y: sy }, beacon: { x: bx, y: by }, dist } of censorMap.data) {
            if (x === bx && y === by) break
            if (Math.abs(x - sx) + Math.abs(y - sy) > dist) {
                continue
            }
            available++
            break
        }
    }
    return available
}

async function getInput(): Promise<SensorMap> {
    var data = await readAocData(DATA_FILE)
    const re = /^Sensor at x=(-?\d+), y=(-?\d+): closest beacon is at x=(-?\d+), y=(-?\d+)$/
    const input = data.lines
        .map(line => re.exec(line))
        .map((match) => [{ x: parseInt(match![1]!), y: parseInt(match![2]!) },
        { x: parseInt(match![3]!), y: parseInt(match![4]!) }] as const)
        .map(([s, b]) => ({ sensor: s, beacon: b, dist: dist(s, b) }))

    const minX = Math.min(...input.flatMap(v => [v.sensor.x, v.beacon.x]))
    const minY = Math.min(...input.flatMap(v => [v.sensor.y, v.beacon.y]))
    const maxX = Math.max(...input.flatMap(v => [v.sensor.x, v.beacon.x]))
    const maxY = Math.max(...input.flatMap(v => [v.sensor.x, v.beacon.y]))
    const maxRange = Math.max(...input.flatMap(v => v.dist))
    console.log(`minX: ${minX}, minY: ${minY}, maxX: ${maxX}, maxY: ${maxY}`)
    return { data: input, bounds: [minX, minY, maxX, maxY, maxRange] as const }
}

function dist(a: Coord, b: Coord): number {
    //return Math.sqrt((b.x - a.x) ** 2 + (b.y - a.y) ** 2)
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y)
}