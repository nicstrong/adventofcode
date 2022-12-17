import { readAocData } from "../util/util.js"


const DATA_FILE = 'data/2022/day16_sample.in'

type DATA = {
    name: string
    rate: number
    connections: string[]
}

export async function day16() {
    const input = await getInput()
    const distances = distanceMap('AA', input)


}

function search(input: DATA[], distances: Map<string, number>) {
    let paths = [{
        curr: 'AA', active: activeValves(input).map(n => n.name),
        timeLeft: 30, finished: false, steps: [], releasedPressure: 0
    }]
    let max = 0
    for (let n = 0; n < paths.length; n++) {
        let path = paths[n]!;
        if (path.timeLeft <= 0) path.finished = true;
        if (path.finished) continue;

        const distance = distances.get(path.curr)!
    }

    function distanceMap(startValve: string, input: DATA[]): Map<string, number> {
        const distances = new Map<string, number>()
        function spread(valve: string, steps: number) {
            if (distances.has(valve) && distances.get(valve)! <= steps) return
            distances.set(valve, steps)
            getValve(valve, input).connections.forEach(x => spread(x, steps + 1))
        }
        spread(startValve, 0)
        return distances
    }

    function getValve(name: string, input: DATA[]): DATA {
        const valve = input.find(x => x.name === name)!
        return valve
    }

    function activeValves(input: DATA[]) {
        return input.filter(x => x.rate > 0)
    }

    async function getInput(): Promise<DATA[]> {
        var data = await readAocData(DATA_FILE)
        const re = /^Valve (?<valve>[A-Z][A-Z]) has flow rate=(?<flow>\d+); tunnels? leads? to valves? (?<list>[A-Z][A-Z](, [A-Z][A-Z])*)$/
        const input = data.lines
            .map(line => re.exec(line))
            .map<DATA>(match => ({
                name: match!.groups!['valve']!,
                rate: parseInt(match!.groups!['flow']!),
                connections: match!.groups!['list']!.split(', ')
            }))

        //input.forEach(x => console.log(JSON.stringify(x)))
        return input
    }