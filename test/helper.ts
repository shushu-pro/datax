/* eslint-disable @typescript-eslint/no-empty-interface */
import { describe, expect, it } from 'vitest';

export { expect, it };

export function tests(name: string, factorys: () => void) {
  describe(name, factorys, {
    repeats: 0,
  });
}

// https://cn.vitest.dev/guide/extending-matchers.html

expect.extend({
  toBeText(received, expected) {
    const { isNot } = this;
    return {
      // 纯中文字符串
      pass: typeof received === 'string' && /^[\u4e00-\u9fa5]+$/.test(received),
      message: () => `${received} ${isNot ? ' 是' : '不是'}中文字符串`,
    };
  },
});

interface CustomMatchers<R = unknown> {
  toBeText(): R;
}

declare module 'vitest' {
  interface Assertion<T = any> extends CustomMatchers<T> {
    // ..
  }
  interface AsymmetricMatchersContaining extends CustomMatchers {
    // ..
  }
}
