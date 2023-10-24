import { writeFileSync } from 'node:fs'
import { writeFile } from 'node:fs/promises'
import { promisify } from 'node:util'
import { gzip as _gzip, gzipSync } from 'node:zlib'

import { js, json, nbt, snbt } from './formats/index'
import { Tag, TagType, validateTag } from './util'

const gzip = promisify(_gzip)

type NBTWriteOptions = {
    filename: string
    format?: 'nbt' | 'snbt' | 'json' | 'js'
    compress?: boolean
}

const checkExtension = (filename: string, extension: string) =>
    filename.endsWith(extension) ? filename : `${filename}.${extension}`

export const write = async (
    root: Tag,
    { filename, format = 'nbt', compress = true }: NBTWriteOptions
) => {
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
        case 'js':
            output = js.serialize(root)
            break
    }
    await writeFile(checkExtension(filename, format), output)
}

export const writeSync = (
    root: Tag,
    { filename, format = 'nbt', compress = true }: NBTWriteOptions
) => {
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
        case 'js':
            output = js.serialize(root)
            break
    }
    writeFileSync(checkExtension(filename, format), output)
}
