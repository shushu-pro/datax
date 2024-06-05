import { expect, it } from 'vitest';

import { DataX } from '../src';
import { tests } from './helper';

tests('payload', () => {
  it('payload.payload', () => {
    const result = DataX.getJSON(
      `
        #id 666
        #data{
          #page 1
        }
        @code $payload.code
        @id $payload.id
        @data{
          @page $payload.data.page
        }
      `,
      { code: 200 }
    );
    expect(result.data).toEqual({
      code: 200,
      id: 666,
      data: {
        page: 1,
      },
    });
  });

  it('payload.body', () => {
    const { data } = DataX.getJSON(
      `
        #body{
          #id
          #page 1
        }

        @id $body.id
        @page $body.page
      `,
      { $body: { id: 200 } }
    );

    expect(data).toEqual({
      id: 200,
      page: 1,
    });
  });

  it('payload.query', () => {
    const { data } = DataX.getJSON(
      `
        #query{
          #id
          #page 1
        }

        @id $query.id
        @page $query.page
      `,
      { $query: { id: 200 } }
    );

    expect(data).toEqual({
      id: 200,
      page: 1,
    });
  });

  it('payload.header', () => {
    const { data } = DataX.getJSON(
      `
        #header{
          #id
          #page 1
        }

        @id $header.id
        @page $header.page
      `,
      { $header: { id: 200 } }
    );

    expect(data).toEqual({
      id: 200,
      page: 1,
    });
  });
});
