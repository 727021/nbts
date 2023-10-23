import { Tag, TagType } from '../util'

export const serialize = (tag: Tag, indentLevel = 0): string => {
    const { type, value } = tag
    const name = tag.name !== undefined
        ? `'${tag.name}'`
        : indentLevel === 0
            ? "''"
            : 'None'
    const indent = new Array(indentLevel).fill('\t').join('')
    switch (type) {
        case TagType.BYTE:
            return `${indent}TAG_Byte(${name}): ${value}`
        case TagType.SHORT:
            return `${indent}TAG_Short(${name}): ${value}`
        case TagType.INT:
            return `${indent}TAG_Int(${name}): ${value}`
        case TagType.LONG:
            return `${indent}TAG_Long(${name}): ${(value as bigint).toString()}L`
        case TagType.FLOAT:
            return `${indent}TAG_Float(${name}): ${value}`
        case TagType.DOUBLE:
            return `${indent}TAG_Double(${name}): ${value}`
        case TagType.BYTE_ARRAY:
            return `${indent}TAG_Byte_Array(${name}): [${(value as Buffer).join(', ')}]`
        case TagType.STRING:
            return `${indent}TAG_String(${name}): '${value}'`
        case TagType.LIST: {
            const val = value as Tag[]
            const entries = `${val.length} ${val.length === 1 ? 'entry' : 'entries'}`
            let str = `${indent}TAG_List(${name}): ${entries}`
            if (val.length > 0) {
                str += `\n${indent}{`
                    + `\n${val.map(t => serialize(t, indentLevel + 1)).join('\n')}`
                    + `\n${indent}}`
            } else {
                str += ' {}'
            }
            return str
        }
        case TagType.COMPOUND: {
            const val = value as Tag[]
            const entries = `${val.length} ${val.length === 1 ? 'entry' : 'entries'}`
            let str = `${indent}TAG_Compound(${name}): ${entries}`
            if (val.length > 0) {
                str += `\n${indent}{`
                    + `\n${val.map(t => serialize(t, indentLevel + 1)).join('\n')}`
                    + `\n${indent}}`
            } else {
                str += ' {}'
            }
            return str
        }
        case TagType.INT_ARRAY:
            return `${indent}TAG_Int_Array(${name}): [${(value as number[]).join(', ')}]`
        case TagType.LONG_ARRAY:
            return `${indent}TAG_Long_Array(${name}): [${(value as bigint[]).map(v => v.toString() + 'L').join(', ')}]`
    }
    return ''
}

export const deserialize = (raw: Buffer): Tag => {
    throw new Error('Not implemented')
}
