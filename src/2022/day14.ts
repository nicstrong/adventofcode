import { readAocData } from '../util/util.js';

const DATA_FILE = 'data/2022/day14.in'

const sandStart = [500, 0] as Coord
type Coord = readonly [number, number]
type Screen = number[][]
type Size = readonly [number, number, number, number]

export async function day14() {
    { // Part 1
        const [paths, screen, size] = await prepare()
        let drops = 0
        while (!dropSand(screen, size[3], false)) drops++;
        console.log(`Part 1: ${drops}`)
        drawScreen(screen, size)
    }


    { // Part 2
        const [paths, screen, size] = await prepare(true)
        let drops = 0
        while (!dropSand(screen, size[3], true)) drops++;
        console.log(`Part 2: ${drops + 1}`)
    }
}

function dropSand(screen: Screen, maxY: number, part2: boolean) {
    let x = sandStart[0]
    let y = sandStart[1]
    let thru = false

    while (true) {
        if (y > maxY + 1) {
            thru = true;
            break
        }
        if (screen[y + 1]![x] === 0) {
            y++
            continue
        }
        if (screen[y + 1]![x - 1] === 0) {
            y++
            x--
            continue
        }
        if (screen[y + 1]![x + 1] === 0) {
            y++
            x++
            continue
        }
        break;
    }

    screen[y]![x] = 2;
    return part2 ? y === 0 : thru;
}

function drawScreen(screen: Screen, size: Size) {
    const [minX, _, maxX, maxY] = size
    for (let y = 0; y <= maxY + 3; y++) {
        let line = ''
        for (let x = minX - 10; x <= maxX / 2 + 20; x++) {
            line += screen[y]![x] === 0 ? '.' : screen[y]![x] === 1 ? '#' : 'o'
        }
        console.log(line)
    }
}

async function prepare(part2?: boolean): Promise<readonly [Coord[][], Screen, Size]> {
    const paths = await getInput()
    const minX = Math.min(...paths.flat().map(v => v[0]))
    const minY = Math.min(...paths.flat().map(v => v[1]))
    const maxX = Math.max(...paths.flat().map(v => v[0])) * 2
    const maxY = Math.max(...paths.flat().map(v => v[1]))


    if (part2) {
        paths.push([[0, maxY + 2], [maxX * 2, maxY + 2]])  // add the floor
    }

    let screen = Array.from({ length: maxY + 4 }, () => Array<number>(maxX * 2).fill(0));
    paths.forEach(point => point.forEach((p, i) => i && drawLine(point[i - 1]!, p, screen)))

    return [paths, screen, [minX, minY, maxX, maxY] as const]
}

function drawLine(from: Coord, to: Coord, screen: number[][]) {
    let min = [Math.min(from[0], to[0]), Math.min(from[1], to[1])] as const
    let max = [Math.max(from[0], to[0]), Math.max(from[1], to[1])] as const
    for (let i = min[0]; i <= max[0]; i++) {
        for (let j = min[1]; j <= max[1]; j++) {
            screen[j]![i] = 1;
        }
    }
}

async function getInput(): Promise<Coord[][]> {
    var data = await readAocData(DATA_FILE)
    const input = data.lines
        .map(line => line.split(' -> '))
        .map((coords) => coords.map((coord) => {
            const [x, y, ...rest] = coord.split(',').map((x) => parseInt(x))
            return [x, y] as Coord
        }))
    return input
}