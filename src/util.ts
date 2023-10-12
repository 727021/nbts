import { byte, compound, double, float, int, intArray, list, long, longArray, short } from './tags'

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

export const tagTypeName = (type: TagType) => Object.entries(TagType).find(([k, v]) => v === type)?.[0] ?? 'unknown'

export type Tag<T = unknown> = { type: TagType, value: T, name?: string }
export type TagFunction<T = unknown> = (value: T, name?: string) => Tag<T>

// TODO:
// If a value is not valid, should an error be thrown,
// or should a valid value be used and a warning be logged?
export const isValidTag = (tag: Tag, requireName = true): boolean => {
    const { type, value, name } = tag
    if (requireName && name === undefined) {
        return false
    }
    if (!requireName && name !== undefined) {
        return false
    }
    switch (type) {
        case TagType.END:
            return true
        case TagType.BYTE: {
            const val = value as ReturnType<typeof byte>['value']
            return val >= -128 && val <= 127
        }
        case TagType.SHORT: {
            const val = value as ReturnType<typeof short>['value']
            return val >= -32_768 && val <= 32_767
        }
        case TagType.INT: {
            const val = value as ReturnType<typeof int>['value']
            return val >= -2_147_483_648 && val <= 2_147_483_647
        }
        case TagType.LONG: {
            const val = value as ReturnType<typeof long>['value']
            return val >= -9_223_372_036_854_775_808n && val <= 9_223_372_036_854_775_807n
        }
        case TagType.FLOAT: {
            const val = value as ReturnType<typeof float>['value']
            return Number.isNaN(val) || val >= 1.175494351e-38 && val <= 3.402823466e+38
        }
        case TagType.DOUBLE: {
            const val = value as ReturnType<typeof double>['value']
            return Number.isNaN(val) || val >= 2.2250738585072014e-308 && val <= 1.7976931348623158e+308
        }
        case TagType.BYTE_ARRAY:
            return true
        case TagType.STRING:
            return true
        case TagType.LIST: {
            // Every child tag must be the same type
            const val = value as ReturnType<typeof list>['value']
            return val.every(tag => tag.type === val[0].type && isValidTag(tag, false))
        }
        case TagType.COMPOUND: {
            // Child tags must have unique names
            const val = value as ReturnType<typeof compound>['value']
            return val.length === new Set(val.map(tag => tag.name)).size && val.every(tag => isValidTag(tag))
        }
        case TagType.INT_ARRAY: {
            const val = value as ReturnType<typeof intArray>['value']
            return val.every(num => num >= -2_147_483_648 && num <= 2_147_483_647)
        }
        case TagType.LONG_ARRAY: {
            const val = value as ReturnType<typeof longArray>['value']
            return val.every(num => num >= -9_223_372_036_854_775_808n && num <= 9_223_372_036_854_775_807n)
        }
        default:
            // Invalid tag type
            return false
    }
}

export const validateTag = (tag: Tag, message?: string) => {
    if (!isValidTag(tag)) {
        throw new Error(message)
    }
}
