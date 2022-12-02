import fs from 'node:fs/promises'

export async function readLines(filename: string): Promise<string[]> {
    const buf = await fs.readFile(filename, 'utf8')
    var data = buf.split("\r\n")
    return data
}