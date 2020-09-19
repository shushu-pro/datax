export default function ({ parse }, { tests, test, assert }) {
  // 定义测试分组
  tests('other', () => {
    test('other 数据动态引用', () => {
      const data = parse(`
            @data{
                @code 'data.code'
                @data2{
                    @code 'data.data2.code'
                    @code1 @code +'.link'
                    @code2 @data.code + '.link'
                }
                @data3{
                    @code @data.code
                }
                @data4 @data3
            }
        `)
      assert.isEqual(data, {
        data: {
          code: 'data.code',
          data2: {
            code: 'data.data2.code',
            code1: 'data.data2.code.link',
            code2: 'data.code.link',
          },
          data3: {
            code: 'data.code',
          },
          data4: {
            code: 'data.code',
          },
        },
      })
    })
  })
}
