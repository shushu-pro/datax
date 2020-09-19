import ijest from 'ijest'
import DataX from '../src'
import feat from './children/feat'
import testField from './children/field'
import testMap from './children/map'
import testList from './children/list'
import testValue from './children/value'
import testJs from './children/js'
import testContext from './children/context'
import testOther from './children/other'
import testValueParser from './children/value-parser'
import testDocument from './children/document'

// document
// https://github.com/sschen86/ijest

ijest({
  // 上下文环境
  context: {
    parse: DataX.parse,
    document: DataX.document,
  },

  // 测试开始前运行
  before (context) {
    // 初始化一些东西
  },

  // 测试结束后运行
  after (context) {
    // 清理东西
  },

  // 所有测试用例
  tests: {
    feat,
    field: testField,
    map: testMap,
    list: testList,
    value: testValue,
    js: testJs,
    context: testContext,
    other: testOther,
    valueParser: testValueParser,
    document: testDocument,
  },

  // 自定义断言
  asserts: {
    // 定义来一个判断值是否是长度为2的字符串断言，可以在测试中使用
    isString2 (value) {
      expect(typeof value).toBe('string')
      expect(value.length).toBe(2)
    },
  },
})
