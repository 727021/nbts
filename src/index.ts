export * as Tag from './tags'
export { write, writeSync } from './writer'

import * as Tag from './tags'
import { write, writeSync } from './writer'

const root = Tag.compound([
    Tag.byte(5, 'test byte'),
    Tag.list([
        Tag.long(1234n),
        Tag.long(4312n)
    ], 'a list!')
], '')

console.log(root)

await write(root, { filename: 'dist/test', format: 'snbt' })
