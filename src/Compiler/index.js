import scanner from './scanner'
import { RuleMatcher, HookMatcher } from './Matchers'

class Compiler {
  constructor ({ matchers, treeBuilder, interpreter, documentBuilder }) {
    this._matchers = {}
    this._treeBuilder = treeBuilder
    this._documentBuilder = documentBuilder
    this._interpreter = interpreter
    this._initSystemMatchers()
    this._initCustomMatchers(matchers)
  }

  compile (code, id = 'main') {
    const sr = scanner(code, this._treeBuilder)
    const mainMatcher = this._matchers[id]
    try {
      while (sr.notEOF()) {
        sr.use(mainMatcher)
      }

      const tree = sr.tree()
      const code = tree.code()
      const execute = this._interpreter(code)
      const document = this._documentBuilder(tree)

      return { tree, code, execute, document }
    } catch (error) {
      return {
        error,
        document: () => [],
        execute () {
          return { error }
        },
      }
    }
  }

  _initSystemMatchers () {
    const matchers = this._matchers
        ;[
      [ 'w', sr => /\w/.test(sr.read()) ],
      [ 'W', sr => /\W/.test(sr.read()) ],
      [ 'd', sr => /\d/.test(sr.read()) ],
      [ 'D', sr => /\D/.test(sr.read()) ],
      [ 's', sr => /\s/.test(sr.read()) ],
      [ 'S', sr => /\S/.test(sr.read()) ],
      [ 'eol', sr => sr.read() === sr.EOL ],
      [ '.', sr => sr.read() !== sr.EOL ],
    ].forEach(([ id, pattern ]) => {
      matchers[id] = new RuleMatcher(id, pattern)
    })
  }

  _initCustomMatchers (matcherOptions) {
    const matchers = this._matchers
    for (const id in matcherOptions) {
      matchers[id] = new HookMatcher(id, matcherOptions[id], this)
    }
  }
}

export default Compiler
