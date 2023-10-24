import { Tag, TagType, tagTypeName } from '../util'

const isLong = (value: string) => /^\d+L$/.test(value)

type BufferObj = { type: 'Buffer'; data: number[] }

const jsonReplacer = (key: string, value: unknown) => {
    if (typeof value === 'bigint') return value.toString() + 'L'
    if (typeof value === 'object' && (value as BufferObj).type === 'Buffer')
        return (value as BufferObj).data
    if (key === 'type') return tagTypeName(value as TagType)
    return value
}

const jsonReviver = (key: string, value: unknown) => {
    if (
        typeof value === 'object' &&
        (value as Tag).type === TagType.BYTE_ARRAY
    ) {
        ;(value as Tag).value = Buffer.from((value as Tag<number[]>).value)
    } else if (typeof value === 'string' && isLong(value)) {
        return BigInt(value.slice(0, value.length - 1))
    } else if (key === 'type') {
        return TagType[value as keyof typeof TagType] ?? value
    }
    return value
}

export const serialize = (root: Tag): string => {
    return JSON.stringify(root, jsonReplacer, 4)
}

export const deserialize = (raw: Buffer): Tag => {
    const str = raw.toString()
    return JSON.parse(str, jsonReviver) as Tag
}
