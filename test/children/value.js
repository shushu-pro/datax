export default function ({ parse }, { tests, test, assert }) {
  // 定义测试分组
  tests('value', () => {
    test('value <return>', () => {
      const data = parse(`
        @value(:
          @ 8
        :)
      `)
      assert.isEqual(data, { value: 8 })
    })

    test('value <blockExpression> <return>', () => {
      const data = parse(`
        @value(:
          const a = 1
          const b = 2
          @ a + b
        :)
      `)
      assert.isEqual(data, { value: 3 })
    })
  })
}
