export default function ({ parse }, { tests, test, assert }) {
  // 定义测试分组
  tests('valueParser', () => {
    test('valueParser 累加器', () => {
      const data = parse(`
        @list(2)[
          @id 100++
          @id2 100--
        ]
      `)

      assert.isEqual(data, {
        list: [
          { id: 100, id2: 100 },
          { id: 101, id2: 99 },
        ],
      })
    })

    test('valueParser 数组取项', () => {
      const data = parse(`
        @list(2)[
          @id  [1,2]..
        ]
      `)

      assert.isEqual(data, {
        list: [
          { id: 1 },
          { id: 2 },
        ],
      })
    })

    test('valueParser 随机取值', () => parse('@id [1,2,3]??'), ({ id }) => {
      assert.isNumber(id)
      assert.isBelong(id, [ 1, 2, 3 ])
    })

    test('valueParser mock指令', () => {
      return parse(`
        @id #number
        @name #random(['张三', '李四'])
      `)
    }, ({ id, name }) => {
      assert.isMatch(id, /^\d$/)
      assert.isBelong(name, [ '张三', '李四' ])
    })
  })
}
