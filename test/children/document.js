export default function ({ document }, { tests, test, assert }) {
  // 定义测试分组
  tests('document', () => {
    test('document fully', () => {
      const doc = document('@code ///  +  string,null  响应码 a')
      assert.isEqual(doc, [
        { description: '响应码 a', flag: '+', key: 'code', types: [ 'string', 'null' ] },
      ])
    })

    test('document flag', () => {
      const doc = document(`
            @key1 /// + null key
            @key2 /// - null key 
            @key3 /// ? null key 
            @key4 /// ! null key
        `)
      assert.isEqual(doc, [
        { description: 'key', flag: '+', key: 'key1', types: [ 'null' ] },
        { description: 'key', flag: '-', key: 'key2', types: [ 'null' ] },
        { description: 'key', flag: '?', key: 'key3', types: [ 'null' ] },
        { description: 'key', flag: '!', key: 'key4', types: [ 'null' ] },
      ])
    })

    test('document noFlag', () => {
      const doc = document(`
            @key1 ///  null key
        `)
      assert.isEqual(doc, [
        { description: 'key', flag: null, key: 'key1', types: [ 'null' ] },
      ])
    })

    test('document types', () => {
      const doc = document(`
              @key1 ///  [string, number, null] key
          `)
      assert.isEqual(doc, [
        { description: 'key', flag: null, key: 'key1', types: [ 'string', 'number', 'null' ] },
      ])
    })

    test('document empty', () => {
      const doc = document(`
            @key1 //  [string, number, null] key
            @key2
        `)
      assert.isEqual(doc, [
        { key: 'key1' },
        { key: 'key2' },
      ])
    })

    test('document level', () => {
      const doc = document(`
            @data{
                @code /// string 响应码
                @list(12)[
                    @id /// string id
                ]
            }
        `)
      assert.isEqual(doc, [
        {
          key: 'data',
          types: [ 'object' ],
          children: [
            { description: '响应码', flag: null, key: 'code', types: [ 'string' ] },
            {
              key: 'list',
              types: [ 'array' ],
              children: [
                { description: 'id', flag: null, key: 'id', types: [ 'string' ] },
              ],
            },
          ],
        },
      ])
    })
  })
}
