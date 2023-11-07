import { Tag, TagType, quote } from '../util'

export const serialize = (tag: Tag, indentLevel = 0): string => {
    const { type, value } = tag
    const nameArg = tag.name === undefined ? '' : `, ${quote(tag.name)}`
    const indent = new Array(indentLevel).fill('\t').join('')

    let output = ''

    switch (type) {
        case TagType.BYTE:
            output = `${indent}Tag.byte(${value as number}${nameArg})`
            break
        case TagType.SHORT:
            output = `${indent}Tag.short(${value as number}${nameArg})`
            break
        case TagType.INT:
            output = `${indent}Tag.int(${value as number}${nameArg})`
            break
        case TagType.LONG:
            output = `${indent}Tag.long(${(value as bigint) + 'n'}${nameArg})`
            break
        case TagType.FLOAT:
            output = `${indent}Tag.float(${value as number}${nameArg})`
            break
        case TagType.DOUBLE:
            output = `${indent}Tag.double(${value as number}${nameArg})`
            break
        case TagType.BYTE_ARRAY:
            output = `${indent}Tag.byteArray(Buffer.from([${(
                value as Buffer
            ).join(',')}])${nameArg})`
            break
        case TagType.STRING:
            output = `${indent}Tag.string(${quote(value as string)}${nameArg})`
            break
        case TagType.LIST:
            output = `${indent}Tag.list([\n${(value as Tag[])
                .map(t => serialize(t, indentLevel + 1))
                .join(',\n')}\n${indent}]${nameArg})`
            break
        case TagType.COMPOUND:
            output = `${indent}Tag.compound([\n${(value as Tag[])
                .map(t => serialize(t, indentLevel + 1))
                .join(',\n')}\n${indent}]${nameArg})`
            break
        case TagType.INT_ARRAY:
            output = `${indent}Tag.intArray([${(value as number[]).join(
                ','
            )}]${nameArg})`
            break
        case TagType.LONG_ARRAY:
            output = `${indent}Tag.longArray([${(value as bigint[])
                .map(i => i.toString() + 'n')
                .join(',')}]${nameArg})`
            break
    }

    if (indentLevel === 0) {
        output =
            "import { Tag } from '@mcstatic/nbts'\n\nconst root = " +
            output +
            '\n'
    }

    return output
}
