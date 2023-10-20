import { gzip as _gzip, gzipSync } from 'node:zlib'
import { promisify } from 'node:util'
import { Tag, TagType, tagTypeName, validateTag } from './util'
import { writeFileSync } from 'node:fs'
import { writeFile } from 'node:fs/promises'
const gzip = promisify(_gzip)

export const toBytes = (tag: Tag): Buffer => {
    // TODO
    return Buffer.from([])
}

/**
 * ```text
 * TAG_Compound(''): 4 entries
 * {
 *   TAG_List('tag name'): 1 entry
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
        case TagType.LIST: {
            const val = value as Tag[]
            const entries = `${val.length} ${val.length === 1 ? 'entry' : 'entries'}`
            let str = `${indent}TAG_List(${name}): ${entries}`
            if (val.length > 0) {
                str += `\n${indent}{`
                    + `\n${val.map(t => toString(t, level + 1)).join('\n')}`
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
                    + `\n${val.map(t => toString(t, level + 1)).join('\n')}`
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

export const jsonReplacer = (key: string, value: any) => {
    if (typeof value === 'bigint') return value.toString()
    return value
}

type NBTWriteOptions = {
    filename: string
    format?: 'nbt' | 'snbt' | 'json'
    compress?: boolean
}

const checkExtension = (filename: string, extension: string) => filename.endsWith(extension) ? filename : `${filename}.${extension}`

export const write = async (root: Tag, {
    filename,
    format = 'nbt',
    compress = true
}: NBTWriteOptions) => {
    if (root.type !== TagType.COMPOUND) {
        throw new Error()
    }
    validateTag(root)
    let nbt
    switch (format) {
        case 'nbt':
            nbt = toBytes(root)
            if (compress) {
                nbt = await gzip(nbt)
            }
            break
        case 'snbt':
            nbt = toString(root)
            break
        case 'json':
            nbt = JSON.stringify(root, jsonReplacer, 4)
            break
    }
    await writeFile(checkExtension(filename, format), nbt)
}
export const writeSync = (root: Tag, {
    filename,
    format = 'nbt',
    compress = true
}: NBTWriteOptions) => {
    if (root.type !== TagType.COMPOUND) {
        throw new Error()
    }
    validateTag(root)
    let nbt
    switch (format) {
        case 'nbt':
            nbt = toBytes(root)
            if (compress) {
                nbt = gzipSync(nbt)
            }
            break
        case 'snbt':
            nbt = toString(root)
            break
        case 'json':
            nbt = JSON.stringify(root, jsonReplacer, 4)
            break
    }
    writeFileSync(checkExtension(filename, format), nbt)
}
