import { expect, it } from 'vitest';

import { DataX } from '../src';
import { tests } from './helper';

tests('value-parser ', () => {
  it('累加器', () => {
    const result = DataX.getJSON(`
      @list(2)[
        @id 100++
        @id2 100--
      ]
    `);
    expect(result.data).toEqual({
      list: [
        { id: 100, id2: 100 },
        { id: 101, id2: 99 },
      ],
    });
  });

  it('数组取项', () => {
    const result = DataX.getJSON(`
      @list(2)[
        @id  [1,2]..
      ]
    `);
    expect(result.data).toEqual({
      list: [{ id: 1 }, { id: 2 }],
    });
  });

  it('随机取值', () => {
    const result = DataX.getJSON(`
      @id [1,2,3]??
    `);
    expect([1, 2, 3]).toContain(result.data.id);
  });

  it('mock指令1', () => {
    const result = DataX.getJSON(`
      @id #number
      @name #random(['张三','李四'])
    `);
    expect(['张三', '李四']).toContain(result.data.name);
    expect(result.data.id).toMatch(/^\d$/);
  });

  it('mock指令2', () => {
    const result = DataX.getJSON(`
      @id #i
    `);
    expect(result.data.id).toBe('i()');
  });
});
