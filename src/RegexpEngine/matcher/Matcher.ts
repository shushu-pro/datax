import { Runtime } from '../Runtime';

export abstract class Matcher {
  /**
   * @description 下一个兄弟节点
   */
  nextSibling: Matcher;

  /**
   * @description 匹配模式不允许回溯
   */
  disableBacktrack: boolean;

  protected m: number;

  protected n: number;

  /**
   * @description 执行匹配器进行扫描
   */
  abstract scan(parentRuntime: Runtime): void;

  constructor() {
    this.m = this.n = 1;

    // const rawScan = this.scan;

    // this.scan = (parentRuntime) => {
    //   console.info('who read witch result is');
    //   console.info(this);
    //   return rawScan.call(this, parentRuntime);
    // };
  }

  suffix(m: number, n: number) {
    this.m = m;
    this.n = n;
  }
}
