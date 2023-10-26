import { Tag } from '../../src/index'

export const helloWorld = Tag.compound(
    [Tag.string('Bananrama', 'name')],
    'hello world'
)

export const bigTest = Tag.compound(
    [
        Tag.long(9223372036854775807n, 'longTest'),
        Tag.short(32767, 'shortTest'),
        Tag.string('HELLO WORLD THIS IS A TEST STRING ÅÄÖ!', 'stringTest'),
        Tag.float(0.4982314705848694, 'floatTest'),
        Tag.int(2147483647, 'intTest'),
        Tag.compound(
            [
                Tag.compound(
                    [Tag.string('Hampus', 'name'), Tag.float(0.75, 'value')],
                    'ham'
                ),
                Tag.compound(
                    [Tag.string('Eggbert', 'name'), Tag.float(0.5, 'value')],
                    'egg'
                )
            ],
            'nested compound test'
        ),
        Tag.list(
            [
                Tag.long(11n),
                Tag.long(12n),
                Tag.long(13n),
                Tag.long(14n),
                Tag.long(15n)
            ],
            'listTest (long)'
        ),
        Tag.list(
            [
                Tag.compound([
                    Tag.string('Compound tag #0', 'name'),
                    Tag.long(1264099775885n, 'created-on')
                ]),
                Tag.compound([
                    Tag.string('Compound tag #1', 'name'),
                    Tag.long(1264099775885n, 'created-on')
                ])
            ],
            'listTest (compound)'
        ),
        Tag.byte(127, 'byteTest'),
        Tag.byteArray(
            Buffer.from(
                new Array(1000)
                    .fill(0)
                    .map((_, n) => (n * n * 255 + n * 7) % 100)
            ),
            'byteArrayTest (the first 1000 values of (n*n*255+n*7)%100, starting with n=0 (0, 62, 34, 16, 8, ...))'
        ),
        Tag.double(0.4931287132182315, 'doubleTest')
    ],
    'Level'
)

export const playerNanValue = Tag.compound(
    [
        Tag.list([Tag.double(0), Tag.double(0), Tag.double(0)], 'Motion'),
        Tag.float(0, 'FallDistance'),
        Tag.list([Tag.double(0), Tag.double(0), Tag.double(0)], 'Pos'),
        Tag.short(20, 'Health'),
        Tag.short(0, 'DeathTime'),
        Tag.short(-20, 'Fire'),
        Tag.short(300, 'Air'),
        Tag.byte(1, 'OnGround'),
        Tag.short(0, 'HurtTime'),
        Tag.list(
            [Tag.float(164.3999481201172), Tag.float(-63.150203704833984)],
            'Rotation'
        ),
        Tag.short(0, 'AttackTime'),
        Tag.list([], 'Inventory')
    ],
    ''
)
