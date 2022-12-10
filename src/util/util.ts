import fs from 'node:fs/promises'
import { AocData, createAocData } from './AocData.js'

export async function readLines(filename: string): Promise<string[]> {
    const buf = await fs.readFile(filename, 'utf8')
    var data = buf.split("\r\n")
    return data
}

export async function readAocData(filename: string): Promise<AocData> {
    const lines = await readLines(filename)
    return createAocData(lines)
}


export function equalMatrix<T>(matrix1: T[][], matrix2: T[][]): boolean {
    if (matrix1.length === 0 || matrix2.length === 0) return false

    // Check if the matrices have the same number of rows and columns.
    if (matrix1.length !== matrix2.length || matrix1[0]!.length !== matrix2[0]!.length) {
        return false;
    }

    // Check if the elements in the matrices are equal.
    for (let i = 0; i < matrix1.length; i++) {
        for (let j = 0; j < matrix1[i]!.length; j++) {
            if (matrix1[i]![j] !== matrix2[i]![j]) {
                return false;
            }
        }
    }

    return true;
}

export const deepCloneMatrix = <T>(matrix: T[][]): T[][] => {
    return matrix.map(row => row.slice());
  }



