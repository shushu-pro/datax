import { Cursor, MatcherOptions } from '../../RegexpEngine';
import { Builder } from '../builder';

export const matchers: MatcherOptions = {
  Main: {
    match: '<Field>! | <PayloadField>! | <JsExpression>!',
  },

  // 字段定义
  Field: {
    match: `
      '@' <FieldKey>
      (
        <eol>! |
        ( <s>+ ( <FieldValueExpression> ) )! |
        ( '(' <s>* ')' )? <DataBlock>! |
        ( '(' <DataListLength> ')' <DataList>! )
      ) 
    `,
    enter: (builder: Builder) => builder.addField(),
    leave: (builder: Builder) => builder.addDone(),
    document: (builder: Builder, text: string) => builder.addDocLine(text),
  },

  // 字段键名
  FieldKey: {
    match: ` ( <w> | '$' )+ `,
    leave: (builder: Builder, text: string) => builder.setFieldKey(text),
  },

  // 字段值表达式
  FieldValueExpression: {
    match(sr: Cursor) {
      return !!sr.readLine();
    },
    leave: (builder: Builder, text: string) =>
      builder.setFieldValueExpression(text),
  },

  DataBlock: {
    match: '<DataMap>! | <DataList>! | <DataValue>!',
  },

  DataMap: {
    match: `
      '{' <eol> 
          <Field>*! 
      '}' <eol> 
    `,
    enter: (builder: Builder) => builder.addMap(),
    leave: (builder: Builder) => builder.addDone(),
  },

  DataList: {
    match: `
      '[' <eol>
          <Field>*! 
      ']' <eol>
    `,
    enter: (builder: Builder) => builder.addList(),
    leave: (builder: Builder) => builder.addDone(),
  },

  DataListLength: {
    /// 16 | length
    match: " <d>+ | (<w> | '.' | '$')+ ",
    leave: (builder: Builder, text: string) => builder.setListLength(text),
  },

  DataValue: {
    match: `
      '(:' <eol> 
        <DataValueBlockExpression>* 
        <DataValueReturnExpression> 
      ':)' <eol>?
    `,
    enter: (builder: Builder) => builder.addValue(),
    leave: (builder: Builder) => builder.addDone(),
  },

  DataValueBlockExpression: {
    match(cr: Cursor) {
      return !/^@|^:\)$/.test(cr.readLine());
    },
    leave: (builder: Builder, text: string) =>
      builder.addValueBlockExpression(text),
  },

  DataValueReturnExpression: {
    match(cr: Cursor) {
      return /^@ /.test(cr.readLine());
    },
    leave: (buider: Builder, text: string) =>
      buider.setValueReturnExpression(text.slice(2)),
  },

  JsExpression: {
    match: ' <.>+ <eol> ',
    enter: (builder: Builder) => builder.addJs(),
    leave: (builder: Builder, text: string) => {
      builder.setJsCodeExpression(text);
      builder.addDone();
    },
  },

  PayloadField: {
    match: `
      '#' <FieldKey>
      (
        <eol>! |
        ( <s>+ ( <FieldValueExpression> ) )! |
        <PayloadDataMap>! |
        <PayloadDataList>!
      ) 
    `,
    enter: (builder: Builder) => builder.addPayloadField(),
    leave: (builder: Builder) => builder.addDone(),
    document: (builder: Builder, text: string) => builder.addDocLine(text),
  },

  PayloadDataMap: {
    match: `
      '{' <eol>
          <PayloadField>*! 
      '}' <eol>
    `,
    enter: (builder: Builder) => builder.addMap(),
    leave: (builder: Builder) => builder.addDone(),
  },

  PayloadDataList: {
    match: `
      '[' <eol>
          <PayloadField>*! 
      ']' <eol>
    `,
    enter: (builder: Builder) => builder.addList(),
    leave: (builder: Builder) => builder.addDone(),
  },
};

export const test1 = `
#page 77
#pageSize 67
#list(8)[
  #id 77
  #name #name
]
#box{
  #ids 666
  #kkk{
    #hhh 88
  }
}
`;
