export default function ({ parse }, { tests, test, assert }) {
  // 定义测试分组
  tests('list', () => {
    test('list empty', () => {
      const data = parse(`@list[
      ]`)
      assert.isEqual(data, { list: [] })
    })

    test('list fields', () => {
      const data = parse(`
        @list(1)[
          @key1 1
          @key2 2
        ]
      `)
      assert.isEqual(data, { list: [ { key1: 1, key2: 2 } ] })
    })

    test('list length=Number', () => {
      const data = parse(`
        @list(2)[
          @key1 1
        ]
      `)
      assert.isEqual(data, { list: [ { key1: 1 }, { key1: 1 } ] })
    })
    test('list length=Varible', () => {
      const data = parse(`
        const length = 2
        @list(length)[
          @key1 1
        ]
      `)
      assert.isEqual(data, { list: [ { key1: 1 }, { key1: 1 } ] })
    })
  })
}
