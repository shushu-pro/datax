import { expect, it } from 'vitest';

import { DataX } from '../src';
import { tests } from './helper';

tests('field', () => {
  it('@fieldKey', () => {
    const result = DataX.getJSON(`
      @code
    `);
    expect(result.data).toEqual({ code: null });
  });

  it('@fieldKey <jsExpression>', () => {
    const result = DataX.getJSON(`
      @code 1+1
    `);
    expect(result.data).toEqual({ code: 2 });
  });

  it('@fieldKey <block>', () => {
    const result = DataX.getJSON(`
      @data{
        @code 1
      }
      @list[
        @code 2
      ]
      @value(:
          let a = 3
          @ a
      :)
    `);
    expect(result.data).toEqual({
      data: { code: 1 },
      list: [
        { code: 2 },
        { code: 2 },
        { code: 2 },
        { code: 2 },
        { code: 2 },
        { code: 2 },
        { code: 2 },
        { code: 2 },
        { code: 2 },
        { code: 2 },
      ],
      value: 3,
    });
  });

  it('@fieldKey <list>', () => {
    const result = DataX.getJSON(`
      @data(2)[
        @code 100
      ]
    `);
    expect(result.data).toEqual({ data: [{ code: 100 }, { code: 100 }] });
  });
});
