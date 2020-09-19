export default function ({ parse }, { tests, test, assert }) {
  // 定义测试分组
  tests('field', () => {
    test('@fieldKey', () => {
      const data = parse('@code')
      assert.isEqual(data, { code: null })
    })

    test('@fieldKey <jsExpression>', () => {
      const data = parse('@code 1+1')
      assert.isEqual(data, { code: 2 })
    })

    test('@fieldKey <block>', () => {
      const data = parse(`
            @data{
                @code 1
            }
            @list[
                @code 2
            ]
            @value(:
                let a = 3
                @ a
            :)
        `)
      assert.isEqual(data, {
        data: { code: 1 },
        list: [ ],
        value: 3,
      })
    })

    test('@fieldKey <list>', () => {
      const data = parse(`
              @data(2)[
                  @code 100
              ]
          `)
      assert.isEqual(data, { data: [ { code: 100 }, { code: 100 } ] })
    })
  })
}
