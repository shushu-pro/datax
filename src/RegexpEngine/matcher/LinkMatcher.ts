import { Runtime, RuntimeError } from '..';
import { ParentMatcher } from './ParentMatcher';

export class LinkMatcher extends ParentMatcher {
  private id: string;

  constructor(id: string) {
    super();
    this.id = id;
  }

  scan(parentRuntime: Runtime) {
    parentRuntime
      .getMatcher(this.id)
      .scan(parentRuntime.createChildRuntime(this));
  }

  childSuccess(childRuntime: Runtime) {
    const selfRuntime = childRuntime.parent;

    selfRuntime.matches++;
    selfRuntime.appendChild(childRuntime);

    // 匹配的次数还未满足贪心匹配的次数，则继续扫描
    if (selfRuntime.matches < this.n) {
      selfRuntime.getMatcher(this.id).scan(selfRuntime);
    }
    // 已经完成匹配次数，通知父级完成匹配
    else {
      selfRuntime.resolve();
    }
  }

  childFailure(childRuntime: Runtime, error: RuntimeError) {
    const selfRuntime = childRuntime.parent;

    if (
      // 不满足必须的匹配次数
      selfRuntime.matches < this.m ||
      // 可选匹配不完整并且匹配器为不允许回溯
      (error.partialMatched && this.disableBacktrack)
    ) {
      selfRuntime.reject(error);
    }
    // 通知父级完成匹配
    else {
      selfRuntime.resolve();
    }
  }
}
