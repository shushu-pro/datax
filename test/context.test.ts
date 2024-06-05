import { expect, it } from 'vitest';

import { DataX } from '../src';
import { tests } from './helper';

tests('context', () => {
  it('$exports', () => {
    const result = DataX.getJSON(`
      @data{
        @code 200
      }
      $exports.data.code = 0 // 重写data.code
      $exports.code = 8 // 添加code
      @code2 $exports.code + 2 // 导出code2
    `);
    expect(result.data).toEqual({ data: { code: 0 }, code: 8, code2: 10 });
  });

  it('$mock', () => {
    const result = DataX.getJSON(`
      @code $mock.random([1])
      @name $mock.name()
    `);
    expect(result.data.code).toBe(1);
    expect(result.data.name).toBeTypeOf('string');
  });

  it('payload', () => {
    const result = DataX.getJSON(
      `
      @data{
        @token $headers.token
        @name $body.name
        @code code()
      }
    `,
      {
        $headers: { token: '1' },
        $body: { name: 'name' },
        code: (code = 0) => code,
      }
    );
    expect(result.data).toEqual({
      data: { token: '1', name: 'name', code: 0 },
    });
  });

  it('字段动态引用', () => {
    const result = DataX.getJSON(
      `
      @data{
        @code 111
        @code2 @code
        @list(2)[
          @code3 @code2+1
        ]
      }
    `
    );
    expect(result.data).toEqual({
      data: {
        code: 111,
        code2: 111,
        list: [{ code3: 112 }, { code3: 112 }],
      },
    });
  });
});
