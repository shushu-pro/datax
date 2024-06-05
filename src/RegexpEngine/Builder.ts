import { Runtime } from './Runtime';

export abstract class Builder {
  /**
   * @description 返回编译后的JS代码
   */
  abstract code(): string;

  /**
   * @description 返回语法树
   */
  abstract tree(): any;

  /**
   * @description 执行构建
   */
  abstract build(runtimes: Runtime[]): void;
}

export class MyBuilder extends Builder {
  code(): string {
    return '';
  }

  tree() {
    return null;
  }

  build(runtimes: Runtime[]): void {
    // ..
  }
}
