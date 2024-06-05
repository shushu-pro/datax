import { expect, it } from 'vitest';

import { DataX } from '../src';
import { tests } from './helper';

tests('value', () => {
  it('value <return>', () => {
    const result = DataX.getJSON(`
      @value(:
        @ [1, 2]  
      :)
    `);
    expect(result.data).toEqual({ value: [1, 2] });
  });

  it('value <blockExpression> <return>', () => {
    const result = DataX.getJSON(`
      @value(:
        const a = 1
        const b = 2
        @ a + b
      :)
    `);
    expect(result.data).toEqual({ value: 3 });
  });
});
