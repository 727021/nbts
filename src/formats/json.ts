import { Tag, tagTypeName } from '../util'

const jsonReplacer = (key: string, value: any) => {
    if (typeof value === 'bigint') return value.toString() + 'L'
    if (typeof value === 'object' && value.type === 'Buffer') return value.data
    if (key === 'type') return tagTypeName(value)
    return value
}

export const serialize = (root: Tag): string => {
    return JSON.stringify(root, jsonReplacer, 4)
}

export const deserialize = (raw: Buffer): Tag => {
    throw new Error('Not implemented')
}
