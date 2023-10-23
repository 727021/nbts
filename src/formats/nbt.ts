import { Tag, TagType } from '../util'

export const serialize = (tag: Tag): Buffer => {
    switch (tag.type) {
        case TagType.BYTE: {
            const named = typeof tag.name === 'string'
            const buf = Buffer.allocUnsafe(1 + (named ? 2 + tag.name!.length : 0) + 1)
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
            const buf = Buffer.allocUnsafe(1 + (named ? 2 + tag.name!.length : 0) + 2)
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
            const buf = Buffer.allocUnsafe(1 + (named ? 2 + tag.name!.length : 0) + 4)
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
            const buf = Buffer.allocUnsafe(1 + (named ? 2 + tag.name!.length : 0) + 8)
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
            const buf = Buffer.allocUnsafe(1 + (named ? 2 + tag.name!.length : 0) + 4)
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
            const buf = Buffer.allocUnsafe(1 + (named ? 2 + tag.name!.length : 0) + 8)
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
            const buf = Buffer.allocUnsafe(1 + (named ? 2 + tag.name!.length : 0) + 4 + val.length)
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
            const buf = Buffer.allocUnsafe(1 + (named ? 2 + tag.name!.length : 0) + 2 + val.length)
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
            const buf = Buffer.allocUnsafe(1 + (named ? 2 + tag.name!.length : 0) + 1 + 4)
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
            return Buffer.concat([
                buf,
                ...tagBuffers
            ])
        }
        case TagType.COMPOUND: {
            const named = typeof tag.name === 'string'
            const val = tag.value as Tag[]
            const buf = Buffer.allocUnsafe(1 + (named ? 2 + tag.name!.length : 0))
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
            const buf = Buffer.allocUnsafe(1 + (named ? 2 + tag.name!.length : 0) + 4 + val.length * 4)
            let offset = 0
            buf.writeInt8(tag.type)
            offset += 1
            if (named) {
                buf.writeUInt16BE(tag.name!.length)
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
            const buf = Buffer.allocUnsafe(1 + (named ? 2 + tag.name!.length : 0) + 4 + val.length * 8)
            let offset = 0
            buf.writeInt8(tag.type)
            offset += 1
            if (named) {
                buf.writeUInt16BE(tag.name!.length)
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

export const deserialize = (raw: Buffer): Tag => {
    throw new Error('Not implemented')
}
