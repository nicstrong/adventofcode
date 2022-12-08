import { readLines } from '../util/util.js'

export async function day7() {
    var data = await readLines('data/2022/day7.in')

    const commands = processCommands(data)

    // for (let i = 0; i < 40; ++i) {
    //     console.log(`cmd[${i}]: ${JSON.stringify(commands[i])}`)
    // }

    commands.shift()
    const root = buildDirectories(commands, { type: 'dir', name: '/', total: 0, children: [] })
    // console.log(`root: ${JSON.stringify(root)}`)

    prettyPrint(root, '')

    const freeSpace = 70000000 - root.total
    const required = 30000000 - freeSpace

    console.log(`Free: ${freeSpace}, Required: ${required}`)

    const under = directoriesUnder(root, 70000000).sort((a, b) => a.total - b.total)
    // under.forEach(d => console.log(`Under ${d.name}: ${d.total}`))

    const closest = under.reduce((acc, d, i) => {
        if (d.total >= required) {
            if (acc === -1 || d.total < under[acc]!.total) {
                return i
            }
        }
        return acc
    }, -1)
    console.log(`Closest(${closest}): ${under[closest]?.total}`)
}

type Dir = {
    type: 'dir'
    name: string,
    total: number
    children: (Dir | File)[]
}
type File = {
    type: 'file',
    name: string,
    size: number
}

function isFile(entry: File | Dir): entry is File {
    return entry.type === 'file'
}
function isDir(entry: File | Dir): entry is Dir {
    return entry.type === 'dir'
}

type DirEntry = { type: 'dir', name: string } | { type: 'file', name: string, size: number }

function directoriesUnder(root: Dir, limit: number): Dir[] {
    let match: Dir[] = []
    if (root.total <= limit) {
        match.push(root)
    }
    for (const dir of root.children.filter(isDir)) {
        match.push(...directoriesUnder(dir, limit))
    }
    return match
}
function buildDirectories(commands: Command[], root: Dir): Dir {

    function totalAcc(total: number, child: File | Dir): number {
        if (isFile(child)) {
            return total + child.size
        }
        return total + child.children.reduce(totalAcc, 0)
    }
    let dirStack: Dir[] = [root]
    let curDir: Dir = root
    for (let i = 0; i < commands.length; ++i) {
        const cmd = commands[i]!
        // console.log(`Processing cmd[${i}]: ${JSON.stringify(cmd)}`)
        if (cmd.type === 'cd') {
            if (cmd.newDir === '..') {
                //console.log(   `Going back a directory from ${curDir.name}`)
                const old = dirStack.shift()
                if (old) old.total = old.children.reduce(totalAcc, 0)
                curDir = dirStack[0]!
                if (!curDir) {
                    old && prettyPrint(old, '')
                    throw new Error(`Failed to pop curDir. index=${i}, cmd=${JSON.stringify(cmd)}, dirStack=${JSON.stringify(dirStack)}, old=${JSON.stringify(old)}`)
                }
            } else {
                const newDir = curDir.children.find(x => x.type === 'dir' && x.name === cmd.newDir) as Dir
                if (!newDir) {
                    throw new Error(`Couldn\'t find ${cmd.newDir} in ${curDir.name}: ${JSON.stringify(curDir)}`)
                }
                curDir = newDir
                dirStack.unshift(newDir)
            }
        }
        if (cmd.type === 'ls') {
            if (cmd.directory !== curDir?.name) {
                throw new Error(`Can\t process ls when curdir doesn\'t match ${cmd.directory} != ${curDir?.name}`)
            }
            //console.log(   `Updating ${curDir.name}.children to ${JSON.stringify(cmd.entries)}`)
            curDir.children = cmd.entries.map(e => e.type === 'dir'
                ? { type: 'dir', name: e.name, total: 0, children: [] }
                : { type: 'file', name: e.name, size: e.size })
        }
    }

    dirStack.forEach((d) => d.total = d.children.reduce(totalAcc, 0))

    return dirStack[dirStack.length - 1]!
}

function prettyPrint(dir: Dir, pad: string) {
    console.log(`${pad}- ${dir.name} (dir, total=${dir.total})`)
    for (const entry of dir.children) {
        if (isFile(entry)) {
            console.log(`${pad}  - ${entry.name} (file, size=${entry.size})`)
        } else {
            const newDir = dir.children.find(c => c.type === 'dir' && c.name === entry.name)! as Dir
            prettyPrint(newDir, pad + "  ")
        }
    }
}

function processCommands(cmds: string[]) {

    const commands = cmds.reduce<{ commands: Command[], cwd: string[] }>((acc, cmdStr) => {
        // console.log(`Processing cmd: ${cmdStr}, acc: ${JSON.stringify(acc)}`)
        const tokens = cmdStr.split(' ')
        if (tokens.length > 1) {
            if (tokens[0] === '$') {
                const cmd = parseCommand(acc.cwd.length === 0 ? null : acc.cwd[acc.cwd.length - 1]!, tokens[1]!, tokens[2])
                return {
                    ...acc,
                    cwd: cmd.type === 'cd'
                        ? cmd.newDir
                            ? cmd.newDir === '..'
                                ? (acc.cwd.length === 1
                                    ? []
                                    : acc.cwd.splice(0, acc.cwd.length - 1))
                                : [...acc.cwd, cmd.newDir]
                            : [...acc.cwd, cmd.newDir]
                        : acc.cwd,
                    commands: [...acc.commands, cmd]
                }
            } else {
                const lastIndex = acc.commands.length - 1
                if (tokens.length !== 2) {
                    throw new Error('Can\'t add result that isn\'t 2 tokens')
                }
                let updateCmd = acc.commands[lastIndex]!
                // console.log(`Processing result: lastIndex: ${lastIndex}, updateCmd: ${JSON.stringify(updateCmd)}`)

                if (updateCmd.type !== 'ls') {
                    throw new Error(`Can\'t add result to non ls command (cmd: ${cmdStr}, top: ${JSON.stringify(updateCmd)})`)
                }
                if (tokens[0] === 'dir') {
                    updateCmd = {
                        ...updateCmd,
                        entries: [...updateCmd.entries, { type: 'dir', name: tokens[1]! }]
                    }
                } else {
                    updateCmd = {
                        ...updateCmd,
                        entries: [...updateCmd.entries, { type: 'file', name: tokens[1]!, size: parseInt(tokens[0]!) }]
                    }
                }
                return {
                    ...acc,
                    commands: lastIndex === 0
                        ? [updateCmd]
                        : [...acc.commands.slice(0, lastIndex), updateCmd]
                }
            }
        }
        const msg = `Cant parse command ${cmdStr}`
        throw new Error(msg)
    }, { commands: [], cwd: [] })

    return commands.commands
}

type Command = {
    type: 'cd'
    newDir: string
} | {
    type: 'ls'
    directory: string
    entries: DirEntry[]
}
function parseCommand(cwd: string | null, cmd: string, arg: string | undefined): Command {
    if (cmd === 'cd' && arg) {
        return { type: 'cd', newDir: arg }
    } else if (cmd === 'ls') {
        return { type: 'ls', directory: cwd!, entries: [] }
    }
    throw new Error(`Can\'t parse unknown command \'${cmd}\'`)

}