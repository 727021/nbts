import { Tag, TagType, tagTypeName, validateTag } from './util'

export const toBytes = (tag: Tag): Buffer => {
    // TODO
    return Buffer.from([])
}

/**
 * ```text
 * TAG_Compound(''): 4 entries
 * {
 *   TAG_List('tag name (int)'): 1 entry
 *   {
 *     TAG_Int(None): 5
 *   }
 *   TAG_String('a string'): 'tag value'
 *   TAG_Long('loooong'): 1234L
 *   TAG_Byte_Array('yeet'): [1, 2, 3, 4]
 * }
 * ```
 */
export const toString = (tag: Tag, level = 0): string => {
    const { type, value } = tag
    const name = tag.name !== undefined
        ? `'${tag.name}'`
        : level === 0
            ? "''"
            : 'None'
    const indent = new Array(level).fill('\t').join('')
    switch(type) {
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
        case TagType.LIST: {
            const val = value as Tag[]
            const entries = `${val.length} ${val.length === 1 ? 'entry' : 'entries'}`
            const listName = `${name.replace(/'$/, '')} (${tagTypeName(val[0]?.type)})${tag.name === undefined ? '' : "'"}`
            return `${indent}TAG_List(${listName}): ${entries}`
                + `\n${indent}{`
                + `\n${val.map(t => toString(t, level + 1)).join('\n')}`
                + `\n${indent}}`
        }
        case TagType.COMPOUND: {
            const val = value as Tag[]
            const entries = `${val.length} ${val.length === 1 ? 'entry' : 'entries'}`
            return `${indent}TAG_Compound(${name}): ${entries}`
                + `\n${indent}{`
                + `\n${val.map(t => toString(t, level + 1)).join('\n')}`
                + `\n${indent}}`
        }
        case TagType.INT_ARRAY:
            return `${indent}TAG_Int_Array(${name}): [${(value as number[]).join(', ')}]`
        case TagType.LONG_ARRAY:
            return `${indent}TAG_Long_Array(${name}): [${(value as bigint[]).map(v => v.toString() + 'L').join(', ')}]`
    }
    return ''
}

export const jsonReplacer = (key: string, value: any) => {
    if (typeof value === 'bigint') return value.toString()
    return value
}

type NBTWriteOptions = {
    filename: string
    format: 'nbt' | 'gz' | 'nbts' | 'json'
}

export const write = async (root: Tag, {
    filename,
    format
}: NBTWriteOptions) => {
    if (root.type !== TagType.COMPOUND) {
        throw new Error()
    }
    validateTag(root)
}
export const writeSync = (root: Tag) => {
    // TODO
}