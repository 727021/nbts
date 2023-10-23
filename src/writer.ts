import { gzip as _gzip, gzipSync } from 'node:zlib'
import { promisify } from 'node:util'
import { Tag, TagType, validateTag } from './util'
import { writeFileSync } from 'node:fs'
import { writeFile } from 'node:fs/promises'
const gzip = promisify(_gzip)
import { nbt, snbt, json } from './formats/index'

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
    let output
    switch (format) {
        case 'nbt':
            output = nbt.serialize(root)
            if (compress) {
                output = await gzip(output)
            }
            break
        case 'snbt':
            output = snbt.serialize(root)
            break
        case 'json':
            output = json.serialize(root)
            break
    }
    await writeFile(checkExtension(filename, format), output)
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
    let output
    switch (format) {
        case 'nbt':
            output = nbt.serialize(root)
            if (compress) {
                output = gzipSync(output)
            }
            break
        case 'snbt':
            output = snbt.serialize(root)
            break
        case 'json':
            output = json.serialize(root)
            break
    }
    writeFileSync(checkExtension(filename, format), output)
}
