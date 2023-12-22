import { serialize } from '../../src/formats/js'
import { bigTest, helloWorld, playerNanValue } from '../data/test-data'

describe('javascript serializer', () => {
    it('fails', () => {
        expect(true).toEqual(false)
    })
    it('serializes hello world correctly', () => {
        const result = serialize(helloWorld)
        expect(result).toMatchSnapshot()
    })

    it('serializes bigtest correctly', () => {
        const result = serialize(bigTest)
        expect(result).toMatchSnapshot()
    })

    it('serializes player-nan-value correvtly', () => {
        const result = serialize(playerNanValue)
        expect(result).toMatchSnapshot()
    })
})
