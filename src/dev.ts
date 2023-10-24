/* eslint-disable */
import { read } from './reader'
import * as Tag from './tags'
import { write, writeSync } from './writer'

const root = Tag.compound(
    [
        Tag.string('Bananarama', 'name'),
        Tag.byteArray(Buffer.from([1, 2, 3, 4, 5]), 'bytes'),
        Tag.long(12345n, 'a long'),
        Tag.longArray([12n, 34n, 56n], 'some longs')
    ],
    'hello world'
)

console.log(root)

await write(root, { filename: 'dist/test', format: 'nbt', compress: false })
console.log('Written!')
const result = await read('dist/test.nbt')
console.log(result)

// const result = await read('bigtest.nbt')
// console.log(result)
// await write(result, { filename: 'bigtest', format: 'snbt' })
