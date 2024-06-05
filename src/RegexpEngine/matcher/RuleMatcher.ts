import { Cursor } from '../Cursor';
import { Runtime } from '../Runtime';
import { Matcher } from './Matcher';

export class RuleMatcher extends Matcher {
  private debugId: string;

  private match: (cr: Cursor) => boolean;

  constructor(match: RuleMatcher['match'], id = '') {
    super();
    this.match = match;
    this.debugId = id;
  }

  scan(parentRuntime: Runtime) {
    const selfRuntime = parentRuntime.createChildRuntime(this);
    const { cr } = selfRuntime;
    const bIndex = cr.chIndex;

    cr.save();
    if (this.match(cr)) {
      cr.remove();
      selfRuntime.resolve(bIndex, cr.chIndex);
    } else {
      cr.rollback();
      selfRuntime.reject({ bIndex });
    }
  }
}
