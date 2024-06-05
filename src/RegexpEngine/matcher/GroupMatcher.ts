import { Runtime, RuntimeError } from '..';
import { Matcher } from './Matcher';
import { ParentMatcher } from './ParentMatcher';

export class GroupMatcher extends ParentMatcher {
  /// 匹配器实现“或”和“与”模式的匹配
  /// 第一层节点为“或”分支，第二层节点为“与”分支
  /**
   *              /-> Or1 -> Or1.And1, Or1.And2, ..., Or1.And999
   * GroupMatcher
   *              \-> Or2 -> Or2.And1, Or2.And2, ..., Or2.And999
   */
  private orHead: GroupNode;

  private curOr: GroupNode;

  private curAnd: Matcher;

  private debugChildren: any[];

  private debugSource: string;

  scan(parentRuntime: Runtime): void {
    const { orHead } = this;
    const andHead = orHead.firstChild;

    andHead.scan(
      parentRuntime.createChildRuntime(this, {
        tempOrChild: orHead,
        tempAndChild: andHead,
        tempSuccessChildren: [],
      })
    );
  }

  childSuccess(childRuntime: Runtime): void {
    // (A{3} B{1,2} | A{2} B{2})
    // 子项扫描成功，则判断是否是最后项，是则进行下一个分量扫描，否则继续下一个子项扫描
    const selfRuntime = childRuntime.parent as unknown as GroupRuntime;

    // 把扫描结果添加到结果链表尾部
    if (selfRuntime.tempLastChild) {
      selfRuntime.tempLastChild.nextSibling = childRuntime;
      selfRuntime.tempLastChild = childRuntime;
    }
    // 初始化扫描结果链表
    else {
      selfRuntime.tempFirstChild = selfRuntime.tempLastChild = childRuntime;
    }

    let { tempAndChild } = selfRuntime;

    // and已经无下一个兄弟节点，则完成一次扫描，并进入下一次or扫描
    if (!tempAndChild.nextSibling) {
      // 结束一轮and子节点的扫描，存入临时结果中
      selfRuntime.tempSuccessChildren.push({
        firstChild: selfRuntime.tempFirstChild,
        lastChild: selfRuntime.tempLastChild,
      });
      selfRuntime.matches++;
      selfRuntime.tempFirstChild = selfRuntime.tempLastChild = null;

      // 开启新的分量扫描
      if (selfRuntime.matches < this.n) {
        selfRuntime.tempOrChild = this.orHead;
        selfRuntime.tempAndChild = this.orHead.firstChild;
        selfRuntime.tempAndChild.scan(selfRuntime);
      }
      // 完成所有扫描
      else {
        this.collectRuntimes(selfRuntime);
      }
    }
    // 继续下一个and子节点的扫描
    else {
      tempAndChild = selfRuntime.tempAndChild = tempAndChild.nextSibling;
      tempAndChild.scan(selfRuntime);
    }
  }

  childFailure(childRuntime: Runtime, error: RuntimeError): void {
    const selfRuntime = childRuntime.parent as GroupRuntime;

    //  部分匹配成功了，用于判断是否停止扫描
    const partialMatched =
      selfRuntime.tempFirstChild &&
      selfRuntime.tempFirstChild.bIndex < selfRuntime.tempLastChild.eIndex;

    // 存在部分匹配的，回退当前匹配的内容
    if (partialMatched) {
      selfRuntime.cr.goto(selfRuntime.tempFirstChild.bIndex);
      selfRuntime.tempFirstChild = selfRuntime.tempLastChild = null;
    }

    // 存在下一个or分支，进入or分支扫描
    if (selfRuntime.tempOrChild.nextSibling && !error.matchStop) {
      // 假如新的错误扫描的更远，则更新错误
      if (
        !selfRuntime.tempError ||
        selfRuntime.tempError.bIndex <= error.bIndex
      ) {
        selfRuntime.tempError = error;
      }

      selfRuntime.tempOrChild = selfRuntime.tempOrChild.nextSibling;
      selfRuntime.tempAndChild = selfRuntime.tempOrChild.firstChild;
      selfRuntime.tempAndChild.scan(selfRuntime);
    }
    // 不满足必须集并且部分匹配
    else if (
      selfRuntime.matches < this.m ||
      (partialMatched && error.matchStop)
    ) {
      const { tempError } = selfRuntime;
      // console.info('@@@@########', bIndex);
      selfRuntime.reject({
        bIndex: (tempError && tempError.bIndex > error.bIndex
          ? tempError
          : error
        ).bIndex,
        partialMatched,
      });
    }
    // 进入扫描结果判断
    else {
      this.collectRuntimes(selfRuntime);
    }
  }

  // 插入新的or分支，通过curAnd为null进行识别

  /**
   * @description 添加新的Or分支，通过设置curAnd为null进行识别
   */
  putOr() {
    this.curAnd = null;
  }

  /**
   * @description 添加新的And子Matcher
   */
  putAnd(matcher: Matcher) {
    const { curOr, curAnd } = this;

    if (this.orHead) {
      // 在 and链表中添加新节点
      if (curAnd) {
        curAnd.nextSibling = matcher;
      }
      // 初始化and链表
      else {
        curOr.nextSibling = this.curOr = { firstChild: matcher };
      }
    }
    // 初始化or链表
    else {
      this.orHead = this.curOr = {
        firstChild: matcher,
      };
    }

    this.curAnd = matcher;
  }

  putEnd(source = '') {
    delete this.curOr;
    delete this.curAnd;
    this.debugSource = source;

    // this.showDebugChildren();
  }

  /**
   * @description 收集已匹配的runtime信息，以链表的格式储存{ tempSuccessChildren:[ {A,B}, {C,D} ] } => { A,B,C,D }
   */
  private collectRuntimes(selfRuntime: GroupRuntime) {
    let tailRuntime: Runtime;
    for (let i = 0; i < selfRuntime.tempSuccessChildren.length; i++) {
      const { firstChild, lastChild } = selfRuntime.tempSuccessChildren[i];
      if (tailRuntime) {
        tailRuntime.nextSibling = firstChild;
        tailRuntime = selfRuntime.lastChild = lastChild;
      } else {
        selfRuntime.firstChild = firstChild;
        tailRuntime = selfRuntime.lastChild = lastChild;
      }
    }

    delete selfRuntime.tempSuccessChildren;
    delete selfRuntime.tempFirstChild;
    delete selfRuntime.tempLastChild;
    // delete selfRuntime.error;

    selfRuntime.resolve();
  }

  private showDebugChildren() {
    const children = [];

    let curOr = this.orHead;
    while (curOr) {
      const andChildren = [];
      let curAnd = curOr.firstChild;
      while (curAnd) {
        andChildren.push(curAnd);
        curAnd = curAnd.nextSibling;
      }
      children.push(andChildren);
      curOr = curOr.nextSibling;
    }
    this.debugChildren = children;
    delete this.orHead;
    // console.info({ children });
  }
}

interface GroupNode {
  firstChild: Matcher;
  nextSibling?: GroupNode;
}

interface GroupRuntime extends Runtime {
  tempError: RuntimeError;
  tempSuccessChildren: Array<{
    firstChild: Runtime;
    lastChild: Runtime;
  }>;
  tempFirstChild: Runtime;
  tempLastChild: Runtime;
  tempOrChild: GroupMatcher['orHead'];
  tempAndChild: GroupMatcher['orHead']['firstChild'];
}
