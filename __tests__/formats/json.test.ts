import { deserialize, serialize } from '../../src/formats/json'
import { bigTest, helloWorld, playerNanValue } from '../data/test-data'

describe('json serializer', () => {
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

describe('json deserializer', () => {
    it('deserializes hello world correctly', () => {
        const json = serialize(helloWorld)
        const result = deserialize(Buffer.from(json))
        expect(result).toEqual(helloWorld)
    })

    it('deserializes bigtest correctly', () => {
        const json = serialize(bigTest)
        const result = deserialize(Buffer.from(json))
        expect(result).toEqual(bigTest)
    })

    it('deserializes player-nan-value correctly', () => {
        const json = serialize(playerNanValue)
        const result = deserialize(Buffer.from(json))
        expect(result).toEqual(playerNanValue)
    })
})
