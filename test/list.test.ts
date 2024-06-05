import { expect, it } from 'vitest';

import { DataX } from '../src';
import { tests } from './helper';

tests('list', () => {
  it('empty.1', () => {
    const result = DataX.getJSON(`
      @list []
    `);
    expect(result.data).toEqual({ list: [] });
  });

  it('empty.2', () => {
    const result = DataX.getJSON(`
      @list[
      ]
    `);
    expect(result.data).toEqual({
      list: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
    });
  });

  it('fields', () => {
    const result = DataX.getJSON(`
      @list(1)[
        @key1 1
        @key2 2
      ]
    `);
    expect(result.data).toEqual({ list: [{ key1: 1, key2: 2 }] });
  });

  it('length=Number', () => {
    const result = DataX.getJSON(`
      @list(2)[
        @key1 1
      ]
    `);
    expect(result.data).toEqual({ list: [{ key1: 1 }, { key1: 1 }] });
  });

  it('length=Varible', () => {
    const result = DataX.getJSON(`
      const length = 2
      @list(length)[
        @key1 1
      ]
    `);
    expect(result.data).toEqual({ list: [{ key1: 1 }, { key1: 1 }] });
  });
});
