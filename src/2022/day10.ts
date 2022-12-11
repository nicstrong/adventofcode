import { readAocData } from '../util/util.js'

type InstructionType = 'noop' | 'addx'
type Instruction = {
    type: 'addx'
    amt: number
} | {
    type: 'noop'
}
type Cpu = readonly [number, number, number] // cycle, register0, signal strength
export async function day10() {
    var data = await readAocData('data/2022/day10.in')

    const instructions = data.getTokens(' ').map<Instruction>(x =>
        x.length === 2
            ? { type: 'addx', amt: parseInt(x[1]!) } as const
            : { type: 'noop' } as const)

    const cycles = [20, 60, 100, 140, 180, 220]

    const cpu: Cpu = [1, 1, 0] as const
    const finalState = instructions.reduce((acc, instruction) => {
        const [cycle, register0, ss] = acc
        const result = execute(instruction, cycle, register0)
        const rangeCycle = inRange(cycles, [cycle, result[0]])
        if (rangeCycle) {
            // console.log(`Executed: ${instruction} ${amt} at cycle ${rangeCycle} with result ${result[0]} (prev: ${acc[1][0]})`)
            const signalStrength = acc[1]! * rangeCycle
            // console.log(`Signal streath: ${signalStrength}`)
            return [result[0], result[1], signalStrength + ss] as const
        }
        return [result[0], result[1], ss] as const
    }, cpu)
    console.log('Part 1: ' + finalState[2])


    const [crt, updateCrt] = createCrt()
    for (const [cycle, x] of runProgram(instructions)) {
        updateCrt(cycle, x)
    }
    renderCrt(crt)
}

function* runProgram(instructions: Instruction[]) {
    let reg0 = 1;
    let currentCycle = 0;

    for (const [cycles, value] of instructions.map(i => i.type === 'addx' ? [2, i.amt] as const : [1, 0] as const)) {
        for (let cycle = 0; cycle < cycles; cycle++) {
            currentCycle++;
            yield [currentCycle, reg0] as const;
        }

        reg0 += value;
    }
}

function renderCrt(screen: Screen) {
    const width = screen[0]!.length;

    for (const row of screen) {
        console.log(row.map(p => p === '.' ? ' ' : p).join(''))
    }
}

type Pixel = '#' | '.';

const spritePosition = (x: number) => new Set([x - 1, x, x + 1]);

type Screen = Array<Pixel[]>;

function createCrt(width = 40, height = 6) {
    const screen: Screen = [
        ...Array(height).fill(0).map((_) => [
            ...Array(width).fill('.'),
        ]),
    ];

    const update = (cycle: number, x: number) => {
        const index = cycle - 1;
        const row = Math.floor(index / width);
        const column = index % width;

        const pixel = spritePosition(x).has(column) ? '#' : '.';
        screen[row]![column] = pixel;
    };
    return [screen, update] as const;
}


function inRange(cycles: number[], r: readonly [number, number]): number | null {
    for (let v of cycles) {
        if (r[0] <= v && r[1] > v) {
            return v
        }
    }
    return null
}

function execute(instruction: Instruction, cycle: number, register0: number): [number, number] {
    switch (instruction.type) {
        case 'noop': return [cycle + 1, register0]
        case 'addx': return [cycle + 2, register0 + instruction.amt]
    }
}