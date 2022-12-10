import { expect } from 'chai'
import { createAocData } from './AocData.js'

const TEST_DATA = [
    'hello world',
    'how are you',
]
const TEST_DATA2 = [
    'abcdefg',
    'hijklmn',
]

describe('createAocData simple text', () => {
    it('Should return lines', () => {
        const aocData = createAocData(TEST_DATA)
        expect(aocData.lines).to.equal(TEST_DATA)
    })

    it('Should return tokenise words', () => {
        const aocData = createAocData(TEST_DATA)
        const tokens = aocData.getTokens(' ')
        expect(tokens[0]).to.eql(['hello', 'world'])
        expect(tokens[1]).to.eql(['how', 'are', 'you'])
    })

    it('Should return tokenise chars', () => {
        const aocData = createAocData(TEST_DATA2)
        const tokens = aocData.getTokens('')
        expect(tokens[0]).to.eql(['a', 'b', 'c', 'd', 'e', 'f', 'g'])
        expect(tokens[1]).to.eql(['h', 'i', 'j', 'k', 'l', 'm', 'n'])
    })
})