/// 遍历runtimes的时候构建语法树

import {
  Builder as SuperBuilder,
  HookMatcher,
  Runtime,
} from '../../RegexpEngine';
import {
  FieldNode,
  JsNode,
  ListNode,
  MapNode,
  PayloadFieldNode,
  ValueNode,
} from './Nodes';

export class Builder extends SuperBuilder {
  rootNode: MapNode;

  curNode: FieldNode | MapNode | JsNode | ValueNode | ListNode;

  fieldNode: FieldNode;

  listNode: ListNode;

  valueNode: ValueNode;

  jsNode: JsNode;

  constructor() {
    super();
    this.createRoot();
  }

  /**
   * @description 添加字段节点
   */
  addField() {
    this.curNode = this.fieldNode = new FieldNode(this);
  }

  setFieldKey(text: string) {
    this.fieldNode.fieldKey = text;
  }

  setFieldValueExpression(text: string) {
    this.fieldNode.fieldValueExpression = text;
  }

  setListLength(length: string) {
    if (!/^\d+$/.test(length) && !/^[$\w.]+$/.test(length)) {
      length = '0';
    }
    this.fieldNode.listLength = length;
  }

  addDone() {
    const { curNode } = this;
    const { prevNode } = curNode as any;

    if (prevNode.fields) {
      prevNode.fields.push(curNode);
    } else {
      prevNode.childNode = curNode;
    }
    this.curNode = prevNode;
  }

  /**
   * @description 添加map节点
   */
  addMap() {
    this.curNode = new MapNode(this);
  }

  /**
   * @description 添加list节点
   */
  addList() {
    this.curNode = this.listNode = new ListNode(this);
  }

  addValue() {
    this.curNode = this.valueNode = new ValueNode(this);
  }

  addValueBlockExpression(text: string) {
    if (!this.valueNode.blockExpressions) {
      this.valueNode.blockExpressions = [];
    }
    this.valueNode.blockExpressions.push(text);
  }

  setValueReturnExpression(text: string) {
    this.valueNode.returnExpression = text;
  }

  addJs() {
    this.curNode = this.jsNode = new JsNode(this);
  }

  setJsCodeExpression(text: string) {
    this.jsNode.codeExpression = text;
  }

  addDocLine(text: string) {
    this.fieldNode.docLine = text;
  }

  addPayloadField() {
    this.curNode = this.fieldNode = new PayloadFieldNode(this);
  }

  code() {
    return this.rootNode.code();
  }

  tree() {
    return this.rootNode;
  }

  build(runtimes: Runtime[]) {
    const walkRuntimes = (runtime: Runtime) => {
      if (!runtime) {
        return;
      }

      const { cr } = runtime;

      const { matcher } = runtime;
      const { hooks } = matcher as HookMatcher;
      const text = hooks ? cr.text(runtime.bIndex, runtime.eIndex) : null;

      hooks?.enter?.(this, text);
      hooks?.document?.(this, cr.docLine(runtime.bIndex));

      if (runtime.firstChild) {
        walkRuntimes(runtime.firstChild);
      }

      hooks?.leave?.(this, text);

      if (runtime.nextSibling) {
        walkRuntimes(runtime.nextSibling);
      }
    };

    runtimes.forEach(walkRuntimes);
  }

  private createRoot() {
    this.rootNode = this.curNode = new MapNode(this);
  }
}
