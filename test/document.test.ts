import { expect, it } from 'vitest';

import { DataX } from '../src';
import { tests } from './helper';

tests('document', () => {
  it('fully', () => {
    const { docList } = DataX.getDocument(`
      @code ///  +  string,null  响应码 a
    `);
    expect(docList).toEqual([
      {
        description: '响应码 a',
        flag: '+',
        key: 'code',
        types: ['string', 'null'],
      },
    ]);
  });

  it('flag', () => {
    const { docList } = DataX.getDocument(`
      @key1 /// + null xxx1
      @key2 /// - null xxx2
      @key3 /// ? null xxx3
      @key4 /// ! null xxx4
    `);
    expect(docList).toEqual([
      { description: 'xxx1', flag: '+', key: 'key1', types: ['null'] },
      { description: 'xxx2', flag: '-', key: 'key2', types: ['null'] },
      { description: 'xxx3', flag: '?', key: 'key3', types: ['null'] },
      { description: 'xxx4', flag: '!', key: 'key4', types: ['null'] },
    ]);
  });

  it('noflag', () => {
    const { docList } = DataX.getDocument(`
      @key1 ///  null key
    `);
    expect(docList).toEqual([
      {
        description: 'key',
        flag: null,
        key: 'key1',
        types: ['null'],
      },
    ]);
  });

  it('types', () => {
    const { docList } = DataX.getDocument(`
      @key1 ///  [string, number, null] xxx1
      @key2 /// string,number xxx2
    `);
    expect(docList).toEqual([
      {
        key: 'key1',
        flag: null,
        types: ['string', 'number', 'null'],
        description: 'xxx1',
      },
      {
        key: 'key2',
        flag: null,
        types: ['string', 'number'],
        description: 'xxx2',
      },
    ]);
  });

  it('empty', () => {
    const { docList } = DataX.getDocument(`
      @key1 //  [string, number, null] key
      @key2
    `);
    expect(docList).toEqual([
      {
        key: 'key1',
        types: [],
        flag: null,
        description: null,
      },
      {
        key: 'key2',
        types: [],
        flag: null,
        description: null,
      },
    ]);
  });

  it('level', () => {
    const { docList } = DataX.getDocument(`
      @data{
        @code /// string 响应码
        @list(12)[
          @id /// string id
        ]
      }
    `);
    expect(docList).toEqual([
      {
        key: 'data',
        types: ['object'],
        flag: null,
        description: null,
        children: [
          {
            description: '响应码',
            flag: null,
            key: 'code',
            types: ['string'],
          },
          {
            key: 'list',
            types: ['array'],
            flag: null,
            description: null,
            children: [{ description: 'id', flag: null, key: 'id', types: ['string'] }],
          },
        ],
      },
    ]);
  });

  it('payload', () => {
    const { docList } = DataX.getDocument(`
      #id 1 /// + number 索引ID
      #list{
        #page /// number 页码
      }
    `);
    expect(docList).toEqual([
      {
        key: 'id',
        types: ['number'],
        flag: '+',
        description: '索引ID',
        isPayload: true,
      },
      {
        key: 'list',
        types: ['object'],
        isPayload: true,
        flag: null,
        description: null,
        children: [
          {
            flag: null,
            key: 'page',
            types: ['number'],
            description: '页码',
          },
        ],
      },
    ]);
  });
});
