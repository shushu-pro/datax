import { Cursor } from '../Cursor';
import { Runtime } from '../Runtime';
import { Matcher } from './Matcher';

export class StringMatcher extends Matcher {
  private source: string;

  constructor(source: string) {
    super();
    this.source = source;
  }

  scan(parentRuntime: Runtime): void {
    const selfRuntime = parentRuntime.createChildRuntime(this);
    const { cr } = selfRuntime;
    const { m, n } = this;
    const bIndex = cr.chIndex;

    // 开始基础匹配
    let partialMatched = false;
    cr.save();
    for (let i = 0; i < m; i++) {
      if (this.match(cr)) {
        partialMatched = true;
      } else {
        cr.rollback();
        selfRuntime.reject({ bIndex, partialMatched });
        return;
      }
    }

    // 开始贪婪匹配
    cr.remove();
    for (let i = m; i < n; i++) {
      cr.save();
      if (this.match(cr)) {
        cr.remove();
      } else {
        cr.rollback();
        break;
      }
    }

    selfRuntime.resolve(bIndex, cr.chIndex);
  }

  match(cr: Cursor) {
    const { source } = this;
    for (let i = 0, lg = source.length; i < lg; i++) {
      if (cr.read() !== source[i]) {
        return false;
      }
    }
    return true;
  }
}
