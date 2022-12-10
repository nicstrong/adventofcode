import { deepCloneMatrix, equalMatrix, readAocData } from '../util/util.js'

export async function day25() {
    var data = await readAocData('data/2021/day25_sample.in')

    let map = data.getTokens('')
    const N = map.length
    const M = map[0]!.length

    let last = deepCloneMatrix(map)
    let moves = 0
    while (true) {
        moves++
        moveHerds(map)
        if (equalMatrix(map, last)) {
            break
        }
        last = deepCloneMatrix(map)
        checkMap(map, moves)
    }

    console.log(`${moves}: ${JSON.stringify(map)}`)
}


export function moveHerds(map: string[][]) {
    for (let i = 0; i < map.length; i++) {
        moveEastFacingRow(map[i]!)
    }
    for (let i = 0; i < map[0]!.length; i++) {
        moveSouthFacingCol(map, i)
    }
}
export function moveSouthFacingCol(map: string[][], col: number) {
    for (let r = 0; r < map.length; r++) {
        if (map[r]![col] === 'v') {
            if (r === map.length - 1) {
                if (map[0]![col] === '.') {
                    map[0]![col] = 'v'
                    map[r]![col] = '.'
                }
            } else {
                if (map[r + 1]![col] === '.') {
                    map[r]![col] = '.'
                    map[r + 1]![col] = 'v'
                    r++
                }
            }
        }
    }
}

export function moveEastFacingRow(row: string[]) {
    let result = row
    for (let i = 0; i < row.length; i++) {
        if (result[i] === '>') {
            if (i === result.length - 1) {
                if (result[0] === '.') {
                    result[0] = '>'
                    result[i] = '.'
                }
            } else {
                if (result[i + 1] === '.') {
                    result[i] = '.'
                    result[i + 1] = '>'
                    i++
                }
            }
        }
    }
    return result
}

function prettyPrint(map: string[][]) {
    let result = ''
    for (let i = 0; i < map.length; i++) {
        result += map[i]!.join('') + '\r\n'
    }
    return result
}

function checkMap(map: string[][], step: number) {

    const expected = expectedMap(step)
    if (!expected) return
    const pass = check(map, expected)

    console.log(`After ${step} step(s):`)
    if (pass) {
        console.log('PASS')
    } else {
        console.log('FAIL')
        console.log(`Expected:`)
        console.log(expected)
        console.log(`Actual:`)
        console.log(prettyPrint(map))
    }

    function check(map: string[][], expected: string) {
        const expectedRows = expected.split('\n')
        // console.log(`expectedRows: ${JSON.stringify(expectedRows)}`)
        for (let r = 0; r < map.length; r++) {
            const act = map[r]!.join('')
            if (act !== expectedRows[r]) {
                console.log(`Row ${r} FAIL`)
                return false
            }
        }
        return true
    }
}
function expectedMap(step: number) {
    switch (step) {
        case 1:
            return `....>.>v.>
v.v>.>v.v.
>v>>..>v..
>>v>v>.>.v
.>v.v...v.
v>>.>vvv..
..v...>>..
vv...>>vv.
>.v.v..v.v`;
        case 2:
            return `>.v.v>>..v
v.v.>>vv..
>v>.>.>.v.
>>v>v.>v>.
.>..v....v
.>v>>.v.v.
v....v>v>.
.vv..>>v..
v>.....vv.`;
    }
    return undefined
}