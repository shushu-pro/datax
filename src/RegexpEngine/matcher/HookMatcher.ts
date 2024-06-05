import { Runtime, RuntimeError } from '../Runtime';
import { DefineMatcher } from '../types';
import { GroupMatcher } from './GroupMatcher';
import { LinkMatcher } from './LinkMatcher';
import { Matcher } from './Matcher';
import { ParentMatcher } from './ParentMatcher';
import { RuleMatcher } from './RuleMatcher';
import { StringMatcher } from './StringMatcher';

const ParserRegexp = RegExp(
  [
    /\s+/, // ignoreBlank
    /'((?:[^']|\\\\|\\')+)'/, // 匹配字符串
    /<([^>]+)>/, // 匹配link
    /(\()/, // groupOpen
    /(\))/, // groupClose
    /([?*+]|\{\d+\}|\{\d+,(?:\d+)?\}|\{,\d+\})/, // "?", "*", "+", "{n}", "{m,}", "{m,n}", "{,n}"
    /(!)/, // "!" 失败则阻止进入"或分支"，直接reject
    /(\|)/, // "|"
    /(.)/, // other
  ]
    .map((item) => item.source)
    .join('|'),
  'g'
);

export class HookMatcher extends ParentMatcher {
  debugId: string;

  hooks: Partial<Pick<DefineMatcher, 'enter' | 'leave' | 'document'>>;

  private matcher: Matcher;

  constructor({ match, enter, leave, document }: DefineMatcher, id: string) {
    super();

    this.debugId = id;
    this.hooks = { enter, leave, document };
    this.matcher = this.parseMatch(match);
    // console.info(this);
  }

  scan(parentRuntime: Runtime): void {
    this.matcher.scan(parentRuntime.createChildRuntime(this));
  }

  childSuccess(childRuntime: Runtime): void {
    const selfRuntime = childRuntime.parent;
    selfRuntime.matches++;
    selfRuntime.appendChild(childRuntime);

    // 继续下一个分量的扫描
    if (selfRuntime.matches < this.n) {
      this.matcher.scan(selfRuntime);
    }
    // 完成扫描
    else {
      selfRuntime.resolve();
    }
  }

  childFailure(childRuntime: Runtime, error: RuntimeError): void {
    const selfRuntime = childRuntime.parent;

    // 基础匹配次数不够，则抛出异常
    if (selfRuntime.matches < this.m) {
      selfRuntime.reject(error);
    }
    // 完成扫描
    else {
      selfRuntime.resolve();
    }
  }

  private parseMatch(match: DefineMatcher['match']) {
    if (typeof match === 'function') {
      return new RuleMatcher(match);
    }

    const source = match;
    const regexp = ParserRegexp;
    const debugGroupBeginIndexStack = [];
    const groupStack = [];
    const rootGroup = new GroupMatcher();
    let curGroup = rootGroup;
    let curMatcher: Matcher = curGroup;

    match.replace(regexp, parse);

    rootGroup.putEnd(source);

    // console.info({ rootGroup });
    return rootGroup;

    function parse(
      all,
      matchString,
      matchLinkName,
      matchGroupOpen,
      matchGroupClose,
      matchSuffix,
      matchStop,
      matchOr,
      matchOther,
      index: number
    ) {
      switch (false) {
        // 分组开始
        case !matchGroupOpen: {
          const newGroup = new GroupMatcher();

          curGroup.putAnd(newGroup);
          groupStack.push(curGroup);
          curMatcher = curGroup = newGroup;

          debugGroupBeginIndexStack.push(index);
          break;
        }

        // 分组结束
        case !matchGroupClose: {
          curMatcher = curGroup;
          curGroup.putEnd(
            (source as string).slice(debugGroupBeginIndexStack.pop(), index + 1)
          );
          curGroup = groupStack.pop();
          break;
        }

        // 开始添加or
        case !matchOr: {
          curGroup.putOr();
          break;
        }

        // 设置匹配次数
        case !matchSuffix: {
          suffix(matchSuffix);
          break;
        }

        case !matchStop: {
          curMatcher.disableBacktrack = true;
          break;
        }

        case !matchLinkName: {
          curGroup.putAnd((curMatcher = new LinkMatcher(matchLinkName)));
          break;
        }

        case !matchString: {
          curGroup.putAnd((curMatcher = new StringMatcher(matchString)));
          break;
        }
      }

      return '';
    }

    function suffix(suffixText: string) {
      switch (suffixText) {
        case '?': {
          curMatcher.suffix(0, 1);
          break;
        }
        case '*': {
          curMatcher.suffix(0, Infinity);
          break;
        }
        case '+': {
          curMatcher.suffix(1, Infinity);
          break;
        }
        default: {
          const suffixNums = suffixText
            .slice(1, -1)
            .split(',')
            .map((item) => Number(item));
          if (suffixNums.length === 1) {
            curMatcher.suffix(suffixNums[0], suffixNums[0]);
          } else {
            curMatcher.suffix(suffixNums[0] || 0, suffixNums[1] || Infinity);
          }
        }
      }
    }
  }
}
