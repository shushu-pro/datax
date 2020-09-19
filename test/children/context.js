export default function ({ parse }, { tests, test, assert }) {
  // 定义测试分组
  tests('context', () => {
    test('context $exports', () => {
      const data = parse(`
        @data{
          @code 200
        }
        $exports.data.code = 0
        $exports.code = 8
        @code2 $exports.code + 2
      `)
      assert.isEqual(data, { data: { code: 0 }, code: 8, code2: 10 })
    })

    test('context $mock', () => {
      const data = parse(`
        @data{
          @code $mock.random([1])
        }
      `)
      assert.isEqual(data, { data: { code: 1 } })
    })

    test('context custom', () => {
      const data = parse(`
        @data{
          @token $headers.token
          @name $body.name
          @code code()
        }
      `, {
        $headers: { token: '1' },
        $body: { name: 'name' },
        code: (code = 0) => code,
      })
      assert.isEqual(data, { data: { token: '1', name: 'name', code: 0 } })
    })
  })
}
