import { Cursor } from './Cursor';
import { Matcher } from './matcher/Matcher';
import { ParentMatcher } from './matcher/ParentMatcher';
import { MatcherContainer } from './MatcherContainer';

export class Runtime {
  cr: Cursor;

  parent: Runtime;

  matcher: Matcher | ParentMatcher;

  data: any;

  firstChild: Runtime;

  lastChild: Runtime;

  nextSibling: Runtime;

  previousSibling: Runtime;

  /**
   * @description 当前匹配的游标开始位置
   */
  bIndex: number;

  /**
   * @description 当前匹配的游标结束位置
   */
  eIndex: number;

  /**
   * @description 已匹配的次数
   */
  matches: number;

  private matchers: MatcherContainer['allMatchers'];

  constructor(parent: Runtime, matcher: Matcher, data?) {
    this.parent = parent;
    this.matcher = matcher;
    this.data = data;

    this.matches = 0;

    if (parent) {
      this.cr = parent.cr;
      this.matchers = parent.matchers;
    }

    if (data) {
      Object.assign(this, data);
    }
  }

  createChildRuntime(matcher: Matcher, data?) {
    return new Runtime(this, matcher, data);
  }

  appendChild(child: Runtime) {
    // 在最后的位置添加子节点
    if (this.lastChild) {
      this.lastChild.nextSibling = child;
      child.previousSibling = this.lastChild;
      this.lastChild = child;
    }
    // 无子节点，则初始化子节点
    else {
      this.firstChild = this.lastChild = child;
    }
  }

  getMatcher(id: string) {
    return this.matchers[id];
  }

  @killRecursion
  resolve(bIndex?: number, eIndex?: number) {
    if (eIndex != null) {
      this.bIndex = bIndex;
      this.eIndex = eIndex;
    }
    // 存在匹配的
    else if (this.firstChild) {
      this.bIndex = this.firstChild.bIndex;
      this.eIndex = this.lastChild.eIndex;
    }
    // 0次匹配
    else {
      this.bIndex = this.cr.chIndex;
      this.eIndex = this.cr.chIndex;
    }

    // console.info('@resolve', this, this.matcher);

    (this.parent.matcher as ParentMatcher).childSuccess(this);
  }

  @killRecursion
  reject(error: RuntimeError) {
    // if (error.stack) {
    //   error.stack.push(this);
    // } else {
    //   error.stack = [this];
    //   error.message = '匹配错误';
    //   error.text = this.cr.text(error.bIndex);
    // }

    if (error.partialMatched && !this.matcher.disableBacktrack) {
      error.matchStop = true;
    }

    // console.info('@reject', this, this.matcher);

    // console.info('@@@@@@@error', error);

    (this.parent.matcher as ParentMatcher).childFailure(this, error);
  }
}

function killRecursion(target, key, descriptor: PropertyDescriptor) {
  const rawFn = descriptor.value;

  let isRuning = false;
  let loopThis;
  let loopArgs;

  descriptor.value = function run(...args) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    loopThis = this;
    loopArgs = args;

    if (!isRuning) {
      try {
        isRuning = true;
        while (loopArgs) {
          const applyArgs = loopArgs;
          loopArgs = null;
          rawFn.apply(loopThis, applyArgs);
        }
      } finally {
        isRuning = false;
      }
    }
  };
}

export interface RuntimeError {
  /**
   * @description 错误发生的游标位置
   */
  bIndex?: number;

  /**
   * @description 错误栈
   */
  stack?: Runtime[];

  /**
   * @description 错误信息
   */
  message?: string;

  /**
   * @description 发生错误的文本内容
   */
  text?: string;

  /**
   * @description 是否存在部分匹配
   */
  partialMatched?: boolean;

  /**
   * @description 是否中断继续扫描
   */
  matchStop?: boolean;
}
