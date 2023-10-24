import { NBTError, Tag, TagType, validateTag } from '../util'

export const serialize = (tag: Tag): Buffer => {
    switch (tag.type) {
        case TagType.BYTE: {
            const named = typeof tag.name === 'string'
            const buf = Buffer.allocUnsafe(
                1 + (named ? 2 + tag.name!.length : 0) + 1
            )
            let offset = 0
            buf.writeInt8(tag.type, offset)
            offset += 1
            if (named) {
                buf.writeUInt16BE(tag.name!.length, offset)
                offset += 2
                if (tag.name!.length > 0) {
                    Buffer.from(tag.name!).copy(buf, offset)
                    offset += tag.name!.length
                }
            }
            buf.writeInt8(tag.value as number, offset)
            return buf
        }
        case TagType.SHORT: {
            const named = typeof tag.name === 'string'
            const buf = Buffer.allocUnsafe(
                1 + (named ? 2 + tag.name!.length : 0) + 2
            )
            let offset = 0
            buf.writeInt8(tag.type, offset)
            offset += 1
            if (named) {
                buf.writeUInt16BE(tag.name!.length, offset)
                offset += 2
                if (tag.name!.length > 0) {
                    Buffer.from(tag.name!).copy(buf, offset)
                    offset += tag.name!.length
                }
            }
            buf.writeInt16BE(tag.value as number, offset)
            return buf
        }
        case TagType.INT: {
            const named = typeof tag.name === 'string'
            const buf = Buffer.allocUnsafe(
                1 + (named ? 2 + tag.name!.length : 0) + 4
            )
            let offset = 0
            buf.writeInt8(tag.type, offset)
            offset += 1
            if (named) {
                buf.writeUInt16BE(tag.name!.length, offset)
                offset += 2
                if (tag.name!.length > 0) {
                    Buffer.from(tag.name!).copy(buf, offset)
                    offset += tag.name!.length
                }
            }
            buf.writeInt32BE(tag.value as number, offset)
            return buf
        }
        case TagType.LONG: {
            const named = typeof tag.name === 'string'
            const buf = Buffer.allocUnsafe(
                1 + (named ? 2 + tag.name!.length : 0) + 8
            )
            let offset = 0
            buf.writeInt8(tag.type, offset)
            offset += 1
            if (named) {
                buf.writeUInt16BE(tag.name!.length, offset)
                offset += 2
                if (tag.name!.length > 0) {
                    Buffer.from(tag.name!).copy(buf, offset)
                    offset += tag.name!.length
                }
            }
            buf.writeBigInt64BE(tag.value as bigint, offset)
            return buf
        }
        case TagType.FLOAT: {
            const named = typeof tag.name === 'string'
            const buf = Buffer.allocUnsafe(
                1 + (named ? 2 + tag.name!.length : 0) + 4
            )
            let offset = 0
            buf.writeInt8(tag.type, offset)
            offset += 1
            if (named) {
                buf.writeUInt16BE(tag.name!.length, offset)
                offset += 2
                if (tag.name!.length > 0) {
                    Buffer.from(tag.name!).copy(buf, offset)
                    offset += tag.name!.length
                }
            }
            buf.writeFloatBE(tag.value as number, offset)
            return buf
        }
        case TagType.DOUBLE: {
            const named = typeof tag.name === 'string'
            const buf = Buffer.allocUnsafe(
                1 + (named ? 2 + tag.name!.length : 0) + 8
            )
            let offset = 0
            buf.writeInt8(tag.type, offset)
            offset += 1
            if (named) {
                buf.writeUInt16BE(tag.name!.length, offset)
                offset += 2
                if (tag.name!.length > 0) {
                    Buffer.from(tag.name!).copy(buf, offset)
                    offset += tag.name!.length
                }
            }
            buf.writeDoubleBE(tag.value as number, offset)
            return buf
        }
        case TagType.BYTE_ARRAY: {
            const named = typeof tag.name === 'string'
            const val = tag.value as Buffer
            const buf = Buffer.allocUnsafe(
                1 + (named ? 2 + tag.name!.length : 0) + 4 + val.length
            )
            let offset = 0
            buf.writeInt8(tag.type, offset)
            offset += 1
            if (named) {
                buf.writeUInt16BE(tag.name!.length, offset)
                offset += 2
                if (tag.name!.length > 0) {
                    Buffer.from(tag.name!).copy(buf, offset)
                    offset += tag.name!.length
                }
            }
            buf.writeInt32BE(val.length, offset)
            offset += 4
            val.copy(buf, offset)
            return buf
        }
        case TagType.STRING: {
            const named = typeof tag.name === 'string'
            const val = tag.value as string
            const buf = Buffer.allocUnsafe(
                1 + (named ? 2 + tag.name!.length : 0) + 2 + val.length
            )
            let offset = 0
            buf.writeInt8(tag.type, offset)
            offset += 1
            if (named) {
                buf.writeUInt16BE(tag.name!.length, offset)
                offset += 2
                if (tag.name!.length > 0) {
                    Buffer.from(tag.name!).copy(buf, offset)
                    offset += tag.name!.length
                }
            }
            buf.writeUInt16BE(val.length, offset)
            offset += 2
            Buffer.from(val, 'utf-8').copy(buf, offset)
            return buf
        }
        case TagType.LIST: {
            const named = typeof tag.name === 'string'
            const val = tag.value as Tag[]
            const tagType = val[0]?.type ?? TagType.END
            const buf = Buffer.allocUnsafe(
                1 + (named ? 2 + tag.name!.length : 0) + 1 + 4
            )
            let offset = 0
            buf.writeInt8(tag.type, offset)
            offset += 1
            if (named) {
                buf.writeUInt16BE(tag.name!.length, offset)
                offset += 2
                if (tag.name!.length > 0) {
                    Buffer.from(tag.name!).copy(buf, offset)
                    offset += tag.name!.length
                }
            }
            buf.writeInt8(tagType)
            offset += 1
            buf.writeInt32BE(val.length)
            const tagBuffers = val.map(serialize)
            return Buffer.concat([buf, ...tagBuffers])
        }
        case TagType.COMPOUND: {
            const named = typeof tag.name === 'string'
            const val = tag.value as Tag[]
            const buf = Buffer.allocUnsafe(
                1 + (named ? 2 + tag.name!.length : 0)
            )
            let offset = 0
            buf.writeInt8(tag.type, offset)
            offset += 1
            if (named) {
                buf.writeUInt16BE(tag.name!.length, offset)
                offset += 2
                if (tag.name!.length > 0) {
                    Buffer.from(tag.name!).copy(buf, offset)
                    offset += tag.name!.length
                }
            }
            const tagBuffers = val.map(serialize)
            return Buffer.concat([
                buf,
                ...tagBuffers,
                Buffer.from([TagType.END])
            ])
        }
        case TagType.INT_ARRAY: {
            const named = typeof tag.name === 'string'
            const val = tag.value as number[]
            const buf = Buffer.allocUnsafe(
                1 + (named ? 2 + tag.name!.length : 0) + 4 + val.length * 4
            )
            let offset = 0
            buf.writeInt8(tag.type)
            offset += 1
            if (named) {
                buf.writeUInt16BE(tag.name!.length, offset)
                offset += 2
                if (tag.name!.length > 0) {
                    Buffer.from(tag.name!).copy(buf, offset)
                    offset += tag.name!.length
                }
            }
            buf.writeInt32BE(val.length, offset)
            offset += 4
            for (const i of val) {
                buf.writeInt32BE(i, offset)
                offset += 4
            }
            return buf
        }
        case TagType.LONG_ARRAY: {
            const named = typeof tag.name === 'string'
            const val = tag.value as bigint[]
            const buf = Buffer.allocUnsafe(
                1 + (named ? 2 + tag.name!.length : 0) + 4 + val.length * 8
            )
            let offset = 0
            buf.writeInt8(tag.type)
            offset += 1
            if (named) {
                buf.writeUInt16BE(tag.name!.length, offset)
                offset += 2
                if (tag.name!.length > 0) {
                    Buffer.from(tag.name!).copy(buf, offset)
                    offset += tag.name!.length
                }
            }
            buf.writeInt32BE(val.length, offset)
            offset += 4
            for (const i of val) {
                buf.writeBigInt64BE(i, offset)
                offset += 8
            }
            return buf
        }
    }
    return Buffer.from([])
}

export const deserialize = (buf: Buffer): Tag => {
    let root: Tag | undefined = undefined

    let offset = 0
    const stack: Tag<Tag[]>[] = []
    const listLength: number[] = []
    const listType: TagType[] = []

    while (offset < buf.length) {
        const tag: Partial<Tag> = {}
        const inList = stack.at(-1)?.type === TagType.LIST

        tag.type = inList ? listType.at(-1)! : buf.readInt8(offset)
        if (!inList) offset += 1

        // We're not in a list, so tags should be named
        if (!inList && tag.type !== TagType.END) {
            const nameLength = buf.readUInt16BE(offset)
            offset += 2
            tag.name = buf
                .subarray(offset, offset + nameLength)
                .toString('utf-8')
            offset += nameLength
        }

        // Get value based on tag type
        switch (tag.type) {
            case TagType.END:
                break
            case TagType.BYTE:
                tag.value = buf.readInt8(offset)
                offset += 1
                break
            case TagType.SHORT:
                tag.value = buf.readInt16BE(offset)
                offset += 2
                break
            case TagType.INT:
                tag.value = buf.readInt32BE(offset)
                offset += 4
                break
            case TagType.LONG:
                tag.value = buf.readBigInt64BE(offset)
                offset += 8
                break
            case TagType.FLOAT:
                tag.value = buf.readFloatBE(offset)
                if (Number.isNaN(tag.value)) {
                    tag.value = 0
                }
                offset += 4
                break
            case TagType.DOUBLE:
                tag.value = buf.readDoubleBE(offset)
                if (Number.isNaN(tag.value)) {
                    tag.value = 0
                }
                offset += 8
                break
            case TagType.BYTE_ARRAY: {
                const arrayLength = buf.readInt32BE(offset)
                offset += 4
                tag.value = Buffer.from(
                    buf.subarray(offset, offset + arrayLength)
                )
                offset += arrayLength
                break
            }
            case TagType.INT_ARRAY: {
                const arrayLength = buf.readInt32BE(offset)
                offset += 4
                tag.value = []
                for (let i = 0; i < arrayLength; ++i) {
                    ;(tag.value as number[]).push(buf.readInt32BE(offset))
                    offset += 4
                }
                break
            }
            case TagType.LONG_ARRAY: {
                const arrayLength = buf.readInt32BE(offset)
                offset += 4
                tag.value = []
                for (let i = 0; i < arrayLength; ++i) {
                    ;(tag.value as bigint[]).push(buf.readBigInt64BE(offset))
                    offset += 8
                }
                break
            }
            case TagType.STRING: {
                const stringLength = buf.readUInt16BE(offset)
                offset += 2
                tag.value = buf
                    .subarray(offset, offset + stringLength)
                    .toString('utf-8')
                offset += stringLength
                break
            }
            case TagType.LIST: {
                listType.push(buf.readInt8(offset))
                offset += 1
                listLength.push(buf.readInt32BE(offset))
                offset += 4
                tag.value = []
                break
            }
            case TagType.COMPOUND:
                tag.value = []
                break
            default:
                throw new NBTError('Invalid tag type', { tag: tag as Tag })
        }

        // add current tag to the compound/list at the top of the stack (unless this is the root tag)
        if (root === undefined) {
            root = tag as Tag
        } else if (tag.type !== TagType.END) {
            // Ignore END tags, they don't have a value
            stack.at(-1)!.value.push(tag as Tag)
        }

        // We've reached the end of a compound tag. Pop it off the stack.
        if (tag.type === TagType.END) {
            stack.pop()
        }

        // handle list and compound stuff
        if (inList) {
            if (--listLength[listLength.length - 1] === 0) {
                // We've reached the end of a list. Pop off.
                listLength.pop()
                listType.pop()
                stack.pop()
            }
        }

        if (tag.type === TagType.COMPOUND) {
            stack.push(tag as Tag<Tag[]>)
        }
        if (tag.type === TagType.LIST) {
            if (listLength.at(-1) === 0) {
                // Handle empty lists
                listLength.pop()
                listType.pop()
            } else {
                stack.push(tag as Tag<Tag[]>)
            }
        }
    }

    if (stack.length) {
        throw new Error('Unclosed tag!')
    }

    if (root == undefined) {
        throw new Error('Something went wrong!')
    }
    validateTag(root, 'Invalid NBT')
    return root
}
