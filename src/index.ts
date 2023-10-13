export * as Tag from './tags'
export { write, writeSync } from './writer'

import * as Tag from './tags'
import { writeSync } from './writer'

const root = Tag.compound([
    Tag.byte(5, 'test byte'),
    Tag.list([

    ], 'a list!')
], '')

console.log(root)

writeSync(root, { filename: 'dist/test', format: 'nbts' })
