# nbts

[![@mcstatic/nbts](https://img.shields.io/npm/v/%40mcstatic/nbts)](https://www.npmjs.com/package/@mcstatic/nbts)
![Build Status](https://img.shields.io/github/actions/workflow/status/727021/nbts/npm-publish.yml)
[![Latest (Pre-)Release Date](https://img.shields.io/github/release-date-pre/727021/nbts)](https://github.com/727021/nbts/releases)
[![MIT License](https://img.shields.io/npm/l/%40mcstatic%2Fnbts)](LICENSE)

A TypeScript library for working with [NBT](https://wiki.vg/NBT) data

<details>
<summary>Contents</summary>

- [nbts](#nbts)
  - [Installation](#installation)
  - [NBT](#nbt)
  - [API](#api)
    - [Creating NBT Data](#creating-nbt-data)
      - [Tag.byte](#tagbyte)
        - [Parameters](#parameters)
      - [Tag.short](#tagshort)
        - [Parameters](#parameters-1)
      - [Tag.int](#tagint)
        - [Parameters](#parameters-2)
      - [Tag.long](#taglong)
        - [Parameters](#parameters-3)
      - [Tag.float](#tagfloat)
        - [Parameters](#parameters-4)
      - [Tag.double](#tagdouble)
        - [Parameters](#parameters-5)
      - [Tag.byteArray](#tagbytearray)
        - [Parameters](#parameters-6)
      - [Tag.string](#tagstring)
        - [Parameters](#parameters-7)
      - [Tag.list](#taglist)
        - [Parameters](#parameters-8)
        - [Examples](#examples)
          - [A list of basic tags](#a-list-of-basic-tags)
          - [A list of lists](#a-list-of-lists)
      - [Tag.compound](#tagcompound)
        - [Parameters](#parameters-9)
        - [Examples](#examples-1)
          - [Simple](#simple)
          - [Nested](#nested)
      - [Tag.intArray](#tagintarray)
        - [Parameters](#parameters-10)
      - [Tag.longArray](#taglongarray)
        - [Parameters](#parameters-11)
    - [Writing NBT Data](#writing-nbt-data)
      - [write](#write)
      - [writeSync](#writesync)
      - [NBTWriteOptions](#nbtwriteoptions)
    - [Reading NBT Data](#reading-nbt-data)
      - [read](#read)
      - [readSync](#readsync)
      - [NBTReadOptions](#nbtreadoptions)
  - [Future Improvements](#future-improvements)
</details>

## Installation

```sh
npm install @mcstatic/nbts
```

```typescript
import { read, readSync, write, writeSync, Tag } from '@mcstatic/nbts'
```

## NBT

> The Named Binary Tag (NBT) file format is an extremely simple and efficient structured binary format used by the Minecraft game for a variety of things.
>
> — https://wiki.vg/NBT

`nbts` currently only supports the NBT specification as used by *Minecraft: Java Edition*. The [changes to the NBT specification](https://wiki.vg/NBT#Bedrock_edition) in *Minecraft: Bedrock Edition* are not currently implemented.

The [changes to Network NBT](https://wiki.vg/NBT#Network_NBT_.28Java_Edition.29) (*Java Edition*) made as of server protocol version 764 are also not currently implemented.

## API

### Creating NBT Data

#### Tag.byte

```ts
byte(value: number, name?: string): Tag<number>
```

##### Parameters

| Name  | Type    | Description                              |
| ----- | ------- | ---------------------------------------- |
| value | number  | A single signed byte (`-128 <= x < 128`) |
| name  | string? | The name of this tag                     |

#### Tag.short

```ts
short(value: number, name?: string): Tag<number>
```

##### Parameters

| Name  | Type    | Description                                              |
| ----- | ------- | -------------------------------------------------------- |
| value | number  | A single signed 16-bit integer (`-32,768 <= x < 32,768`) |
| name  | string? | The name of this tag                                     |

#### Tag.int

```ts
int(value: number, name?: string): Tag<number>
```

##### Parameters

| Name  | Type    | Description                                                            |
| ----- | ------- | ---------------------------------------------------------------------- |
| value | number  | A single signed 32-bit integer (`-2,147,483,648 <= x < 2,147,483,648`) |
| name  | string? | The name of this tag                                                   |

#### Tag.long

```ts
long(value: bigint, name?: string): Tag<bigint>
```

##### Parameters

| Name  | Type    | Description                                                                                    |
| ----- | ------- | ---------------------------------------------------------------------------------------------- |
| value | bigint  | A single signed 64-bit integer (`-9,223,372,036,854,775,808 <= x < 9,223,372,036,854,775,808`) |
| name  | string? | The name of this tag                                                                           |

#### Tag.float

```ts
float(value: number, name?: string): Tag<number>
```

##### Parameters

| Name  | Type    | Description                              |
| ----- | ------- | ---------------------------------------- |
| value | number  | A single-precision floating-point number |
| name  | string? | The name of this tag                     |

#### Tag.double

```ts
double(value: number, name?: string): Tag<number>
```

##### Parameters

| Name  | Type    | Description                              |
| ----- | ------- | ---------------------------------------- |
| value | number  | A double-precision floating-point number |
| name  | string? | The name of this tag                     |

#### Tag.byteArray

```ts
byteArray(value: Buffer, name?: string): Tag<Buffer>
```

##### Parameters

| Name  | Type    | Description                                |
| ----- | ------- | ------------------------------------------ |
| value | Buffer  | A list of signed bytes (`-128 <= x < 128`) |
| name  | string? | The name of this tag                       |

#### Tag.string

```ts
string(value: string, name?: string): Tag<string>
```

##### Parameters

| Name  | Type    | Description              |
| ----- | ------- | ------------------------ |
| value | string  | A variable-length string |
| name  | string? | The name of this tag     |

#### Tag.list

```ts
list(value: Tag[], name?: string): Tag<Tag[]>
```

##### Parameters

| Name  | Type    | Description                                                                                               |
| ----- | ------- | --------------------------------------------------------------------------------------------------------- |
| value | Tag[]   | A variable-length list of tags. All tags in the list **must** be the same type and **must not** be named. |
| name  | string? | The name of this tag                                                                                      |

##### Examples

###### A list of basic tags
```ts
Tag.list([
  Tag.float(123.456),
  Tag.float(234.576),
  Tag.float(345.678)
], 'list of floats')
```

###### A list of lists
```ts
Tag.list([
  Tag.list([
    Tag.float(123.456),
    Tag.float(234.576),
    Tag.float(345.678)
  ]),
  Tag.list([
    Tag.string('this'),
    Tag.string('is'),
    Tag.string('a'),
    Tag.string('list!')
  ])
], 'nested lists')
```

#### Tag.compound

```ts
compound(value: Tag[], name?: string): Tag<Tag[]>
```

##### Parameters

| Name  | Type    | Description                                                                                         |
| ----- | ------- | --------------------------------------------------------------------------------------------------- |
| value | Tag[]   | A variable-length list of tags. All tags in the list **must** be named, but can be different types. |
| name  | string? | The name of this tag                                                                                |

##### Examples

###### Simple

```ts
Tag.compound([
  Tag.string('Bananarama', 'name')
], 'a simple compound tag')
```

###### Nested

```ts
const root = Tag.compound([
	Tag.string('Bananarama', 'name'),
	Tag.byteArray(Buffer.from([1, 2, 3, 4, 5]), 'bytes'),
  Tag.compound([
    Tag.long(12345n, 'a long'),
    Tag.longArray([12n, 34n, 56n], 'some longs'),
    Tag.list([
      Tag.string('this'),
      Tag.string('is'),
      Tag.string('a'),
      Tag.string('list!')
    ], 'a list in a nested compound')
  ], 'a nested compound tag')
], 'hello world')
```

#### Tag.intArray

```ts
intArray(value: number[], name?: string): Tag<number[]>
```

##### Parameters

| Name  | Type     | Description                                                              |
| ----- | -------- | ------------------------------------------------------------------------ |
| value | number[] | A list of signed 32-bit integers (`-2,147,483,648 <= x < 2,147,483,648`) |
| name  | string?  | The name of this tag                                                     |

#### Tag.longArray

```ts
longArray(value: bigint[], name?: string): Tag<bigint[]>
```

##### Parameters

| Name  | Type     | Description                                                                                      |
| ----- | -------- | ------------------------------------------------------------------------------------------------ |
| value | bigint[] | A list of signed 64-bit integers (`-9,223,372,036,854,775,808 <= x < 9,223,372,036,854,775,808`) |
| name  | string?  | The name of this tag                                                                             |

### Writing NBT Data

When writing NBT data to a file, the root tag **must** be a COMPOUND tag.

Various output formats are supported, as detailed below in [NBTWriteOptions](#nbtwriteoptions).

#### write

```ts
write(root: Tag, options: NBTWriteOptions): Promise<void>
```

#### writeSync

```ts
writeSync(root: Tag, options: NBTWriteOptions): void
```

#### NBTWriteOptions

```ts
type NBTWriteOptions = {
  filename: string
  format?: "nbt" | "snbt" | "json" | "js" | undefined
  compress?: boolean | undefined
}
```

| Name     | Type                | Description                                                                                                                      |
| -------- | ------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| filename | string              | The path to write NBT data to                                                                                                    |
| format   | nbt, snbt, json, js | (Optional) The format of the data being read. If not provided, this will be inferred based on file extension. Defaults to `nbt`. |
| compress | boolean             | (Optional) Whether to use gzip compression. Only used with `nbt` format. Defaults to `true`.                                     |

### Reading NBT Data

#### read

```ts
read(filename: string, options?: NBTReadOptions): Promise<Tag>
```

#### readSync

```ts
read(filename: string, options?: NBTReadOptions): Tag
```

#### NBTReadOptions

```ts
type NBTReadOptions = {
  format?: 'nbt' | 'json'
}
```

| Name   | Type            | Description                                                                                                                                               |
| ------ | --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| format | nbt, snbt, json | (Optional) The format of the data being read. If not provided, this will be inferred from the file extension. Defaults to `nbt` if it cannot be inferred. |

## Future Improvements

The following are possible future enhancements to be made to `nbts`:

- Add support for reading snbt data
- Add support for protocol versions >= 764
- Add support for *Minecraft: Bedrock Edition* NBT data
- Add a command-line interface for converting files between NBT and other formats
