import { readLines } from '../util/util.js'

export async function day6() {
    var data = await readLines('data/2022/day6.in')

    console.log(`part1 1: ${startMarker('mjqjpqmgbljsphdztnvjfqwrcgsmlb', 4)}`)
    console.log(`part1 2: ${startMarker('bvwbjplbgvbhsrlpgdmjqwftvncz', 4)}`)
    console.log(`part1 3: ${startMarker('nppdvjthqldpwncqszvftbrmjlhg', 4)}`)
    console.log(`part1 4: ${startMarker('nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg', 4)}`)
    console.log(`part1 5: ${startMarker('zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw', 4)}`)
    console.log(`part1 answer: ${startMarker(data[0]!,4 )}`)
    console.log()
    console.log(`part2 1: ${startMarker('mjqjpqmgbljsphdztnvjfqwrcgsmlb', 14)}`)
    console.log(`part2 2: ${startMarker('bvwbjplbgvbhsrlpgdmjqwftvncz', 14)}`)
    console.log(`part2 3: ${startMarker('nppdvjthqldpwncqszvftbrmjlhg', 14)}`)
    console.log(`part2 4: ${startMarker('nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg', 14)}`)
    console.log(`part2 5: ${startMarker('zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw', 14)}`)
    console.log(`part2 answer: ${startMarker(data[0]!, 14)}`)
}




function startMarker(input: string, len: number) {
    function isUnique(str: string) {
        return new Set(str).size == str.length;
    }

    for (let i = 0; i < input.length; ++i) {
        const next = input.substring(i, i + len)
        if (isUnique(next)) {
            return i + len
        }

    }
    return -1
}