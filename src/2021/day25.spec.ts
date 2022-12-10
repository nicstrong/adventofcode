import { expect } from "chai"
import { moveEastFacingRow } from "./day25"

describe('moveEastFacingRow', () => {
    it('step1', () => {
        const actual = moveEastFacingRow('...>>>>>...'.split(''))
        expect(actual).to.eql('...>>>>.>..'.split(''))
    })
    it('step2', () => {
        const actual = moveEastFacingRow('...>>>>.>..'.split(''))
        expect(actual).to.eql('...>>>.>.>.'.split(''))
    })
})