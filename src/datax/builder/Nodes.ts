import { Builder } from './Builder';
import transformValueExpression from './transformValueExpression';

abstract class Node {
  builder: Builder;

  prevNode: Node | NodeContainer;

  constructor(builder: Builder) {
    this.builder = builder;
    this.prevNode = builder.curNode;
  }

  doc() {
    throw Error('Node.doc must be override');
  }

  code(): string {
    throw Error('Node.code must be override');
  }
}

class NodeContainer extends Node {
  fields: Array<FieldNode>;

  constructor(builder: Builder) {
    super(builder);
    this.fields = [];
  }

  /**
   * @description 获取字段逻辑代码
   */
  codeFields() {
    return this.fields.map((field) => field.code()).join('\n');
  }

  /**
   * @description 字段keys
   */
  codeKeys() {
    const keys = [];
    this.fields.forEach((item) => {
      if (!item.fieldValueExpression && !item.childNode) {
        keys.push(item.fieldKey);
      }
    });
    return keys.join(', ');
  }

  // 文档逻辑
  docFields() {
    return this.fields.map((item) => item.doc()).join('\n');
  }
}

class FieldNode extends Node {
  /**
   * @description 字段的key
   */
  fieldKey: string;

  /**
   * @description 字段的值表达式
   */
  fieldValueExpression: string;

  /**
   * @description 值为list类型的字段，控制list的length
   */
  listLength: string;

  /**
   * @description 子节点
   */
  childNode: Node;

  /**
   * @description 字段文档
   */
  docLine: string;

  code() {
    const key = this.codeFieldKey();

    const { fieldValueExpression, childNode } = this;
    let codeBody: string;

    if (fieldValueExpression) {
      codeBody = `$value(function(){
        return ${transformValueExpression(fieldValueExpression)}
      });`;
    } else if (childNode) {
      codeBody = childNode.code();
    } else {
      codeBody = `$value(function(){
        return this.${key}
      });`;
    }

    return `$field("${key}", function(){
      ${codeBody}
    });`;
  }

  codeFieldKey() {
    return this.fieldKey.replace(/[^.]+\./, '');
  }
}

class MapNode extends NodeContainer {
  type = 'map';

  code() {
    return `$map(function(){
      ${this.codeFields()}
    });`;
  }
}

class ListNode extends NodeContainer {
  prevNode: FieldNode;

  childNode: MapNode | ValueNode;

  type = 'list';

  code() {
    const { prevNode, childNode } = this;
    const bodyCode = childNode
      ? childNode.code()
      : `$map(function(){
        ${this.codeFields()}
      });`;

    return `$list(${prevNode.listLength || 10}, function(){
      ${bodyCode}
    });`;
  }
}

class ValueNode extends NodeContainer {
  /**
   * @description 块级表达式
   */
  blockExpressions: string[];

  /**
   * @description 返回值表达式
   */
  returnExpression: string;

  code() {
    return `$value(function(){
      ${this.blockExpressions ? this.blockExpressions.join('') : ''}
      return ${this.returnExpression}
    });`;
  }
}

class JsNode extends Node {
  codeExpression: string;

  code() {
    return this.codeExpression;
  }
}

class PayloadFieldNode extends Node {
  type = 'pfield';

  /**
   * @description 字段的key
   */
  fieldKey: string;

  /**
   * @description 字段的值表达式
   */
  fieldValueExpression: string;

  /**
   * @description 值为list类型的字段，控制list的length
   */
  listLength: string;

  /**
   * @description 子节点
   */
  childNode: Node;

  /**
   * @description 字段文档
   */
  docLine: string;

  code() {
    const key = this.codeFieldKey();

    const { fieldValueExpression, childNode } = this;
    let codeBody: string;

    if (fieldValueExpression) {
      codeBody = `$value(function(){
        return ${transformValueExpression(fieldValueExpression)}
      });`;
    } else if (childNode) {
      codeBody = childNode.code();
    } else {
      codeBody = `$value(function(){
        return this.${key}
      });`;
    }

    return `$pfield("${key}", function(){
      ${codeBody}
    });`;
  }

  codeFieldKey() {
    return this.fieldKey.replace(/[^.]+\./, '');
  }
}

export { FieldNode, JsNode, ListNode, MapNode, PayloadFieldNode, ValueNode };
