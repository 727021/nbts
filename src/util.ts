import {
    byte,
    compound,
    int,
    intArray,
    list,
    long,
    longArray,
    short
} from './tags'

export enum TagType {
    END,
    BYTE,
    SHORT,
    INT,
    LONG,
    FLOAT,
    DOUBLE,
    BYTE_ARRAY,
    STRING,
    LIST,
    COMPOUND,
    INT_ARRAY,
    LONG_ARRAY
}

interface NBTErrorOptions extends ErrorOptions {
    tag?: Tag
}
export class NBTError extends Error {
    #tag?: Tag
    get tag() {
        return this.#tag
    }
    constructor(message?: string, options?: NBTErrorOptions) {
        super(message, options)
        this.#tag = options?.tag
    }
}

export const tagTypeName = (type: TagType) =>
    Object.entries(TagType).find(([, v]) => v === type)?.[0]

export type Tag<T = unknown> = { type: TagType; value: T; name?: string }
export type TagFunction<T = unknown> = (value: T, name?: string) => Tag<T>

export const isValidTag = (tag: Tag, requireName = true): void => {
    const { type, value, name } = tag
    if (requireName && name === undefined) {
        throw new NBTError('Tag must have a name', { tag })
    }
    if (!requireName && name !== undefined) {
        throw new NBTError('Tag must not have a name', { tag })
    }
    switch (type) {
        case TagType.END:
            return
        case TagType.BYTE: {
            const val = value as ReturnType<typeof byte>['value']
            if (val < -128 || val > 127) {
                throw new NBTError('Value out of range', { tag })
            }
            break
        }
        case TagType.SHORT: {
            const val = value as ReturnType<typeof short>['value']
            if (val < -32_768 || val > 32_767) {
                throw new NBTError('Value out of range', { tag })
            }
            break
        }
        case TagType.INT: {
            const val = value as ReturnType<typeof int>['value']
            if (val < -2_147_483_648 || val > 2_147_483_647) {
                throw new NBTError('Value out of range', { tag })
            }
            break
        }
        case TagType.LONG: {
            const val = value as ReturnType<typeof long>['value']
            if (
                val < -9_223_372_036_854_775_808n ||
                val > 9_223_372_036_854_775_807n
            ) {
                throw new NBTError('Value out of range', { tag })
            }
            break
        }
        case TagType.FLOAT:
            // Numbers in JavaScript are all 64-bit IEEE-754 numbers, so there's not much we can check for float and double.
            break
        case TagType.DOUBLE:
            break
        case TagType.BYTE_ARRAY:
            break
        case TagType.STRING:
            break
        case TagType.LIST: {
            // Every child tag must be the same type
            const val = value as ReturnType<typeof list>['value']
            if (
                !val.every(tag => {
                    isValidTag(tag, false)
                    return tag.type === val[0].type
                })
            ) {
                throw new NBTError('All tags in a list must be the same type', {
                    tag
                })
            }
            break
        }
        case TagType.COMPOUND: {
            // Child tags must have unique names
            const val = value as ReturnType<typeof compound>['value']
            if (val.length !== new Set(val.map(tag => tag.name)).size) {
                throw new NBTError(
                    'Children of a compound tag must have unique names',
                    { tag }
                )
            }
            val.forEach(tag => isValidTag(tag))
            break
        }
        case TagType.INT_ARRAY: {
            const val = value as ReturnType<typeof intArray>['value']
            if (
                !val.every(num => num >= -2_147_483_648 && num <= 2_147_483_647)
            ) {
                throw new NBTError('Value out of range', { tag })
            }
            break
        }
        case TagType.LONG_ARRAY: {
            const val = value as ReturnType<typeof longArray>['value']
            if (
                !val.every(
                    num =>
                        num >= -9_223_372_036_854_775_808n &&
                        num <= 9_223_372_036_854_775_807n
                )
            ) {
                throw new NBTError('Value out of range', { tag })
            }
            break
        }
        default:
            throw new NBTError('Invalid tag type', { tag })
    }
}

export const validateTag = (tag: Tag, message?: string) => {
    try {
        isValidTag(tag)
    } catch (error) {
        if (message) {
            throw new Error(message, { cause: error })
        } else {
            throw error
        }
    }
}

export const quote = (str: string) =>
    `'${str.replaceAll("'", "\\'").replaceAll('\n', '\\n')}'`
