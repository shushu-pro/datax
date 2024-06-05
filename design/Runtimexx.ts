class Runtimexxxx {
  curNode: LinkNode | GroupNode;

  linkNode: LinkNode;

  addKey() {
    this.linkNode = this.curNode as LinkNode;
    this.linkNode.addKey();
  }

  addNode<T extends LinkNode>() {
    this.linkNode = this.curNode as T;
  }

  // notInstanceof<T extends LinkNode | GroupNode>(Type: new () => T) {
  //   if (!(this.curNode instanceof Type)) {
  //     throw Error('类型不对');
  //   }
  // }
}

class SuperNode {
  // ..
}

class GroupNode extends SuperNode {
  addField() {
    // ..
  }
}

class LinkNode extends SuperNode {
  addKey() {
    // ..
  }
}
