import { expect, it } from 'vitest';

import { DataX } from '../src';
import { tests } from './helper';

tests('map', () => {
  it('empty.1', () => {
    const result = DataX.getJSON(`
      @data {}
    `);
    expect(result.data).toEqual({ data: {} });
  });

  it('empty.2', () => {
    const result = DataX.getJSON(`
      @data{
      }
    `);
    expect(result.data).toEqual({ data: {} });
  });

  it('fields', () => {
    const result = DataX.getJSON(`
      @data{
        @key1 1
        @key2 2
      }
    `);
    expect(result.data).toEqual({ data: { key1: 1, key2: 2 } });
  });

  it('map', () => {
    const result = DataX.getJSON(`
      @data{
        @data{
          @key1 1
          @key2 2
        }
      }
    `);
    expect(result.data).toEqual({ data: { data: { key1: 1, key2: 2 } } });
  });

  it('list', () => {
    const result = DataX.getJSON(`
      @data{
        @list(2)[
          @key1 1
          @key2 2
        ]
      }
    `);
    expect(result.data).toEqual({
      data: {
        list: [
          { key1: 1, key2: 2 },
          { key1: 1, key2: 2 },
        ],
      },
    });
  });
});
