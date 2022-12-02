import { readLines } from "./util/util.js"

const DRAW_PTS = 3
const WIN_PTS = 6
enum Move {
    Rock,
    Paper,
    Scissor,
}

enum Result {
    Win = 'Win',
    Loss = 'Loss',
    Draw = 'Draw'
}

export async function day2() {
    var data = await readLines('data/day2.data')


    const scores = data
        .map(r => r.split(' '))
        //.map(p => part1(convert(p[0]!), convert(p[1]!)))
        .map(p => part2(convert(p[0]!), requiredResult(p[1]!)))


    //scores.forEach((s, i) => console.log(`${i}: ${s[0]} - ${s[1]}`))
    const wins = scores.filter(r => r[0] === Result.Win)
    const draws = scores.filter(r => r[0] === Result.Draw)
    const losses = scores.filter(r => r[0] === Result.Loss)
    const total = scores.reduce((acc, r) => acc + r[1], 0)
    console.log(`Wins: ${wins.length}, Draws: ${draws.length}, Losses: ${losses.length}`)
    console.log(`Total score: ${total}`)

}

// function part1(them: Move, us: Move): [Result, number] {
//     const res = result(them, us)
//     return [res,
//         moveScore(us) + (res === Result.Win ? WIN_PTS : res === Result.Draw ? DRAW_PTS : 0)]
// }

function part2(them: Move, required: Result): [Result, number] {
    const move = resultMove(them, required)
    return [required,
        moveScore(move) + (required === Result.Win ? WIN_PTS : required === Result.Draw ? DRAW_PTS : 0)]
}

function resultMove(them: Move, required: Result): Move {
    if (required === Result.Draw) {
        return them
    }
    switch (them) {
        case Move.Rock: {
            return required === Result.Win ? Move.Paper : Move.Scissor
        }
        case Move.Paper: {
            return required === Result.Win ? Move.Scissor : Move.Rock
        }
        case Move.Scissor: {
            return required === Result.Win ? Move.Rock : Move.Paper
        }
    }
}

// function result(them: Move, us: Move): Result {
//     if (them === us) {
//         return Result.Draw
//     }
//     switch (them) {
//         case Move.Rock: {
//             return us === Move.Paper ? Result.Win : Result.Loss
//         }
//         case Move.Paper: {
//             return us === Move.Scissor ? Result.Win : Result.Loss
//         }
//         case Move.Scissor: {
//             return us === Move.Rock ? Result.Win : Result.Loss
//         }
//     }
// }

function requiredResult(move: string) {
    switch (move) {
        case 'X': return Result.Loss
        case 'Y': return Result.Draw
    }
    return Result.Win
}


function convert(move: string) {
    if (move === 'A' || move === 'X') return Move.Rock
    if (move === 'B' || move === 'Y') return Move.Paper
    return Move.Scissor
}

function moveScore(move: Move) {
    switch (move) {
        case Move.Rock: return 1
        case Move.Paper: return 2
        case Move.Scissor: return 3
    }
}


