export * as Tag from './tags'
export { write, writeSync } from './writer'

import * as Tag from './tags'
import { write, writeSync } from './writer'

const root = Tag.compound([
    Tag.string('Bananarama', 'name')
], 'hello world')

console.log(root)

await write(root, { filename: 'dist/test', format: 'json' })
