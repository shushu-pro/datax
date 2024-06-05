import { expect, it } from 'vitest';

import { DataX } from '../src';
import { tests } from './helper';

tests('js', () => {
  it('js mix', () => {
    const result = DataX.getJSON(`
      const a = getName()

      @data{
        @name1 a + '666'
        @name2 getName()
      }
      
      function getName(){
        return 'name'
      }
    `);

    expect(result.data).toEqual({
      data: {
        name1: 'name666',
        name2: 'name',
      },
    });
  });
});
