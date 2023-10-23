import { gunzip as _gunzip, gunzipSync } from 'node:zlib'
import { promisify } from 'node:util';
import { readFileSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
const gunzip = promisify(_gunzip)
import { Tag, validateTag } from './util';
import { nbt, snbt, json } from './formats/index'

type NBTReadOptions = {
    format?: 'nbt' | 'snbt' | 'json'
}

const checkFormat = (filename: string, format?: NBTReadOptions['format']): NonNullable<NBTReadOptions['format']> => {
    if (format) return format
    const extension = filename.split('.').at(-1)
    if (extension === 'snbt' || extension === 'json') return extension
    return 'nbt'
}

const isCompressed = (buf: Buffer) => buf[0] === 0x1f && buf[1] === 0x8b

export const read = async (filename: string, { format }: NBTReadOptions = {}): Promise<Tag> => {
    let raw = await readFile(filename)
    format = checkFormat(filename, format)
    let output
    switch (format) {
        case 'nbt':
            if (isCompressed(raw)) {
                raw = await gunzip(raw)
            }
            output = nbt.deserialize(raw)
            break
        case 'snbt':
            output = snbt.deserialize(raw)
            break
        case 'json':
            output = json.deserialize(raw)
            break
        default:
            throw new Error('Invalid format')
    }
    validateTag(output)
    return output
}

export const readSync = (filename: string, { format }: NBTReadOptions = {}): Tag => {
    let raw = readFileSync(filename)
    format = checkFormat(filename, format)
    let output
    switch (format) {
        case 'nbt':
            if (isCompressed(raw)) {
                raw = gunzipSync(raw)
            }
            output = nbt.deserialize(raw)
            break
        case 'snbt':
            output = snbt.deserialize(raw)
            break
        case 'json':
            output = json.deserialize(raw)
            break
        default:
            throw new Error('invalid format')
    }
    validateTag(output)
    return output
}
