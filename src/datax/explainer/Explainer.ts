import * as $mock from '@shushu.pro/mockv';

import { Explainer as SuperExplainer } from '../../RegexpEngine';
import { docParser } from './docParser';

export class Explainer extends SuperExplainer {
  run(code: string, payload: Payload) {
    try {
      const { ctx, apply } = this.createContext(payload);
      const vars = Object.keys(ctx);

      // eslint-disable-next-line no-new-func
      Function(vars.join(','), code)(...vars.map((key) => ctx[key]));

      apply();

      return { error: null, data: ctx.$exports };
    } catch (error) {
      return { error, data: null };
    }
  }

  doc(tree: any) {
    const rootDoc = [];
    const list = [{ node: tree, docList: rootDoc }];
    let curNode;

    // eslint-disable-next-line no-cond-assign
    while ((curNode = list.shift())) {
      const { node, docList } = curNode;
      let docItem;
      if (node.fieldKey) {
        docList.push(
          (docItem = {
            key: node.fieldKey,
            types: [],
            flag: null,
            description: null,
            ...docParser(node.docLine),
          })
        );

        if (node.type === 'pfield' && !node.prevNode.prevNode) {
          docItem.isPayload = true;
        }
      }

      // console.info({ docItem, curNode });

      if (node.fields) {
        list.push(...node.fields.map((item) => ({ node: item, docList })));
      } else if (node.childNode) {
        list.push({ node: node.childNode, docList: (docItem.children = []) });
        if (node.childNode.type === 'map') {
          docItem.types = ['object'];
        } else if (node.childNode.type === 'list') {
          docItem.types = ['array'];
        }
      }
    }

    return { error: null, docList: rootDoc };
  }

  private createContext(payload: Payload) {
    const $payload = { ...payload };
    const $exports = {};
    const $body = { ...payload.$body };
    const $query = { ...payload.$query };
    const $header = { ...payload.$header };
    const presetPayloadKeys = ['body', 'query', 'header'];
    let rootNode = null;

    let bus: Bus;
    const builtinAPI = {
      $payload,
      $exports,

      $body,
      $query,
      $header,

      $mock,

      $map: (getter: Getter) => {
        if (bus) {
          MapNode.explain(bus, getter);
        } else {
          bus = { curNode: null };
          rootNode = bus.curNode = new MapNode(bus, getter);
        }
      },

      $field: (key: string, getter: Getter) => {
        const prevNode = bus.curNode;

        if (prevNode === rootNode) {
          $exports[key] = FieldNode.explain(bus, key, getter).value(bus);
        } else {
          FieldNode.explain(bus, key, getter);
        }
        bus.curNode = prevNode;
      },

      $value: (getter: Getter) => {
        ValueNode.explain(bus, getter);
      },

      $list: (arr: ListNode['arr'], getter: Getter) => {
        ListNode.explain(bus, getter, arr);
      },

      $pfield: (key: string, getter: Getter) => {
        const prevNode = bus.curNode;
        if (prevNode === rootNode) {
          const value = PayloadFieldNode.explain(bus, key, getter).value(bus);
          if (presetPayloadKeys.includes(key)) {
            Object.assign(builtinAPI[`$${key}`], {
              ...value,
              ...builtinAPI[`$${key}`],
            });
          } else {
            $payload[key] = value;
          }
        } else {
          PayloadFieldNode.explain(bus, key, getter);
        }
        bus.curNode = prevNode;
      },

      $log(...args) {
        console.warn(...args);
      },
    };

    return {
      apply() {
        bus.curNode.value(bus);
      },
      ctx: {
        ...payload,
        ...builtinAPI,
      },
    };
  }
}

let uuid = 0;

class Node {
  private uuid: number;

  curNode: AllNode;

  parentNode: AllNode;

  childNode: AllNode;

  Context: any;

  context: any;

  getter: Getter;

  constructor(bus: Bus, getter: Getter) {
    this.uuid = uuid++;
    this.parentNode = bus.curNode;
    this.Context = function Context() {
      // ..
    };
    this.context = this.Context.prototype = this.parentNode
      ? new this.parentNode.Context()
      : {}; // 从上一级环境中继承上下文变量
    // this.context.PID = this.PID
    // this.context.NodeType = this.constructor.name
    this.getter = getter;
  }

  // 在获取值的时候，通过调用getter生成子节点结构
  getterProxy(bus: Bus) {
    bus.curNode = this;
    bus.curNode.getter.call(this.context, bus);
    bus.curNode = this.parentNode;
  }

  appendChild(childNode: Node['childNode']) {
    return (this.childNode = childNode);
  }

  value(bus: Bus) {
    throw Error(
      `Node.value must be override by ${this.constructor.name}.value`
    );
  }
}

class MapNode extends Node {
  static explain(bus: Bus, getter: Getter) {
    bus.curNode.appendChild(new MapNode(bus, getter));
  }

  private fields: Record<string, any>;

  constructor(bus: Bus, getter: Getter) {
    super(bus, getter);
    this.fields = {};
  }

  appendChild(childNode: Node['childNode']) {
    // 后续的同名字段会覆盖前面的字段
    this.fields[(childNode as FieldNode).key] = childNode;

    // console.info('@map.append', {
    //   wrapper: this,
    //   key: (childNode as FieldNode).key,
    // });

    return childNode;
  }

  value(bus: Bus) {
    this.getterProxy(bus);
    const value = {};

    for (const key in this.fields) {
      bus.curNode = this;

      // console.info('@map.value', {
      //   wrapper: this,
      //   key,
      // });

      value[key] = this.context[key] = this.fields[key].value(bus);

      // 将值挂载到外层环境中,没有必要让外层共享
      // let curNode = this.parentNode as FieldNode;
      // while (curNode) {
      //   const fieldKey = curNode.key;
      //   if (fieldKey) {
      //     (curNode.parentNode.context[fieldKey] =
      //       curNode.parentNode.context[fieldKey] || {})[key] = value[key];
      //     break;
      //   }
      //   curNode = curNode.parentNode as FieldNode;
      // }

      bus.curNode = this.parentNode;
    }
    return value;
  }
}

class FieldNode extends Node {
  static explain(bus: Bus, key: string, getter: Getter) {
    return bus.curNode.appendChild(new FieldNode(bus, key, getter));
  }

  key: string;

  constructor(bus: Bus, key: string, getter: Getter) {
    super(bus, getter);
    this.key = key;
  }

  value(bus: Bus) {
    this.getterProxy(bus);
    if (this.childNode) {
      return this.childNode.value(bus);
    }
    return null;
  }
}

class ListNode extends Node {
  static explain(bus: Bus, getter: Getter, arr: ListNode['arr']) {
    bus.curNode.appendChild(new ListNode(bus, getter, arr));
  }

  private arr: number | Array<any>;

  constructor(bus: Bus, getter: Getter, arr) {
    super(bus, getter);
    this.arr = arr;
    this.context.$total = 0;
  }

  value(bus: Bus) {
    this.getterProxy(bus);
    bus.curNode = this;
    const value = [];
    const { childNode } = this;
    if (!childNode) {
      return value;
    }

    // 数据库模式
    if (Array.isArray(this.arr)) {
      const rs = this.arr;
      for (let i = 0; i < rs.length; i++) {
        this.context.$index = i;
        this.context.$total++;
        Object.assign(this.context, rs[i]);
        value.push(this.childNode.value(bus));
      }
    }
    // 常规模式
    else {
      for (let i = 0; i < this.arr; i++) {
        this.context.$index = i;
        this.context.$total++;
        value.push(this.childNode.value(bus));
      }
    }

    bus.curNode = this.parentNode;
    return value;
  }
}

class ValueNode extends Node {
  static explain(bus: Bus, getter: Getter) {
    return bus.curNode.appendChild(new ValueNode(bus, getter));
  }

  value(bus: Bus) {
    const value = this.getter.call(this.context, bus);
    return value === undefined ? null : value;
  }
}

class BlockNode extends Node {
  static explain(bus: Bus, getter: Getter) {
    return bus.curNode.appendChild(new BlockNode(bus, getter));
  }

  value(bus: Bus) {
    bus.curNode = this;
    const value = this.getter.call(this.context);
    bus.curNode = this.parentNode;

    return value;
  }
}

class PayloadFieldNode extends Node {
  static explain(bus: Bus, key: string, getter: Getter) {
    return bus.curNode.appendChild(new PayloadFieldNode(bus, key, getter));
  }

  key: string;

  constructor(bus: Bus, key: string, getter: Getter) {
    super(bus, getter);
    this.key = key;
  }

  value(bus: Bus) {
    this.getterProxy(bus);
    if (this.childNode) {
      return this.childNode.value(bus);
    }
    return null;
  }
}

type AllNode =
  | Node
  | MapNode
  | ListNode
  | BlockNode
  | FieldNode
  | ValueNode
  | PayloadFieldNode;
type Payload = Record<string, any>;
type Getter = () => any;
type Bus = { curNode: AllNode };
type DocItem = {
  key: string;
  types: string[];
  flag?: '+' | '-' | '?' | '!';
  description: string;
  isPayload: boolean;
};
