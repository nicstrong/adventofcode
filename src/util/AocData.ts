export type AocData = {
    lines: string[]
    getTokens(seperator: string): string[][]
}

export function createAocData(lines: string[]): AocData {
    return {
        lines: lines,
        getTokens: function(seperator: string = ' '): string[][] {
            return lines.map(line => line.split(seperator))
        }
    }
}