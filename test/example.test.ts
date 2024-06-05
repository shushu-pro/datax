import { expect, it } from 'vitest';

import { DataX } from '../src';
import { tests } from './helper';

tests('example', () => {
  it('example.classic', () => {
    const { data } = DataX.getJSON(`
      @code #number /// + string 状态码
      @data{
        @page 1
        @pageSize 20
        @dataList(20)[
            @id 100++ /// number,null 数据ID
            @name #name
            @name2 @name + @id
            @age #number(1,20) /// number 年龄
            @address ['浙江', '北京', '上海']??
            @email #email
            @mobile #mobile
            @avatar #img('100x100')
            @books(2)[
              @name ['三国演义', '水浒传']..
              @price #decimal
              @content #paragraph(2)
              @onSale #bool
            ]
        ]
        @xo(: /// ? number 密密麻麻
          const kkk = 12
          @ 999   +kkk
        :)
        @names(1)[
          @name1 getName('name1')
          @name2 getName()
        ]
      }

      function getName(name = '#'){
        return name
      }
    `);

    expect(data).toBeTypeOf('object');
    expect(data).toHaveProperty(['code']);
    expect(data.data.dataList[0].name2).toBe(data.data.dataList[0].name + data.data.dataList[0].id);
    expect(data.data.xo).toBe(999 + 12);
    expect(data.data.names).toEqual([{ name1: 'name1', name2: '#' }]);
  });
});
