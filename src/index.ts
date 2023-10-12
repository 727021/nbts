export * as Tag from './tags'
export { write, writeSync } from './files'

import * as Tag from './tags'
import { toString } from './files'

const root = Tag.compound([
    Tag.byte(5, 'test byte')
], '')

console.log(root)
