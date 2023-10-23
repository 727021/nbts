import { Tag, TagType, tagTypeName } from '../util'

const isLong = (value: string) => /^\d+L$/.test(value)

const jsonReplacer = (key: string, value: any) => {
    if (typeof value === 'bigint') return value.toString() + 'L'
    if (typeof value === 'object' && value.type === 'Buffer') return value.data
    if (key === 'type') return tagTypeName(value)
    return value
}

const jsonReviver = (key: string, value: any) => {
    if (typeof value === 'object' && value.type === TagType.BYTE_ARRAY) {
        value.value = Buffer.from(value.value)
    } else if (typeof value === 'string' && isLong(value)) {
        return BigInt(value.slice(0, value.length - 1))
    } else if (key === 'type') {
        return TagType[value] ?? value
    }
    return value
}

export const serialize = (root: Tag): string => {
    return JSON.stringify(root, jsonReplacer, 4)
}

export const deserialize = (raw: Buffer): Tag => {
    const str = raw.toString()
    return JSON.parse(str, jsonReviver)
}
