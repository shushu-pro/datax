export default function ({ parse }, { tests, test, assert }) {
  // 定义测试分组
  tests('js', () => {
    test('js mix', () => {
      const data = parse(`
        const a = getName()

        @data{
          @name1 a
          @name2 getName()
        }

        function getName(){
          return 'name'
        }
      `)
      assert.isEqual(data, { data: { name1: 'name', name2: 'name' } })
    })
  })
}
