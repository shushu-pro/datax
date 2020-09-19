export default function ({ parse }, { tests, test, assert }) {
  // 定义测试分组
  tests('map', () => {
    test('map empty', () => {
      const data = parse(`@data{
      }`)
      assert.isEqual(data, { data: {} })
    })

    test('map fields', () => {
      const data = parse(`@data{
        @key1 1
        @key2 2
      }`)
      assert.isEqual(data, { data: { key1: 1, key2: 2 } })
    })

    test('map map', () => {
      const data = parse(`@data{
        @data{
          @key1 1
          @key2 2
        }
      }`)
      assert.isEqual(data, { data: { data: { key1: 1, key2: 2 } } })
    })
    test('map list', () => {
      const data = parse(`@data{
        @list(2)[
          @key1 1
          @key2 2
        ]
      }`)
      assert.isEqual(data, { data: { list: [ { key1: 1, key2: 2 }, { key1: 1, key2: 2 } ] } })
    })
  })
}
