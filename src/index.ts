export * as Tag from './tags'
export { write, writeSync } from './writer'

import * as Tag from './tags'
import { write, writeSync } from './writer'
import { read } from './reader'
import { deserialize } from './formats/nbt'

// const root = Tag.compound([
//     Tag.string('Bananarama', 'name'),
//     Tag.byteArray(Buffer.from([1, 2, 3, 4, 5]), 'bytes'),
//     Tag.long(12345n, 'a long'),
//     Tag.longArray([12n, 34n, 56n], 'some longs')
// ], 'hello world')

// console.log(root)

// await write(root, { filename: 'dist/test', format: 'json' })
// console.log('Written!')
// const result = await read('dist/test.json')
// console.log(result)

const raw = Buffer.concat([
    Buffer.from([1, 0, 6]),
    Buffer.from('a byte', 'utf-8'),
    Buffer.from([123])
])
console.log(raw)
const result = deserialize(raw, 0)
console.log(result)
