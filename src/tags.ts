import { Tag, TagFunction, TagType, validateTag } from './util'

// TODO: Don't validate everything on create?
// it messes things up with always needing a name except for children of a list tag

export const byte: TagFunction<number> = (value, name) => {
    const tag = {
        type: TagType.BYTE,
        value,
        name
    }
    validateTag(tag)
    return tag
}

export const short: TagFunction<number> = (value, name) => {
    const tag = {
        type: TagType.SHORT,
        value,
        name
    }
    validateTag(tag)
    return tag
}

export const int: TagFunction<number> = (value, name) => {
    const tag = {
        type: TagType.INT,
        value,
        name
    }
    validateTag(tag)
    return tag
}

export const long: TagFunction<bigint> = (value, name) => {
    const tag = {
        type: TagType.LONG,
        value,
        name
    }
    validateTag(tag)
    return tag
}

export const float: TagFunction<number> = (value, name) => {
    const tag = {
        type: TagType.FLOAT,
        value,
        name
    }
    validateTag(tag)
    return tag
}

export const double: TagFunction<number> = (value, name) => {
    const tag = {
        type: TagType.DOUBLE,
        value,
        name
    }
    validateTag(tag)
    return tag
}

export const byteArray: TagFunction<Buffer> = (value, name) => {
    const tag = {
        type: TagType.BYTE_ARRAY,
        value: Buffer.copyBytesFrom(value),
        name
    }
    validateTag(tag)
    return tag
}

export const string: TagFunction<string> = (value, name) => {
    const tag = {
        type: TagType.STRING,
        value,
        name
    }
    validateTag(tag)
    return tag
}

export const list: TagFunction<Tag[]> = (value, name) => {
    const tag = {
        type: TagType.LIST,
        value,
        name
    }
    validateTag(tag)
    return tag
}

export const compound: TagFunction<Tag[]> = (value, name) => {
    const tag = {
        type: TagType.COMPOUND,
        value,
        name
    }
    validateTag(tag)
    return tag
}

export const intArray: TagFunction<number[]> = (value, name) => {
    const tag = {
        type: TagType.INT_ARRAY,
        value,
        name
    }
    validateTag(tag)
    return tag
}

export const longArray: TagFunction<bigint[]> = (value, name) => {
    const tag = {
        type: TagType.LONG_ARRAY,
        value,
        name
    }
    validateTag(tag)
    return tag
}
