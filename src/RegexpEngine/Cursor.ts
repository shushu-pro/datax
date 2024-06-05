const EOL = '\n';

export class Cursor {
  static readonly EOL = EOL;

  private chAlls: string[];

  private chLines: Array<[number, number, number, string]>;

  private indexStack: number[];

  chIndex: number;

  get notEOF() {
    return this.chIndex < this.chAlls.length;
  }

  get isEOF() {
    return !this.notEOF;
  }

  constructor(code: string) {
    const chAlls = (this.chAlls = []);
    const chLines = (this.chLines = []);
    this.indexStack = [];
    this.chIndex = 0;

    let line = 0;
    code.split(/\r\n?|\r?\n/).forEach((textLine) => {
      line++;
      let codeLine = textLine.trim();

      if (!codeLine) {
        return;
      }
      // 解析文档内容
      let documentLine: string;
      codeLine = codeLine
        .replace(/\/\/(\/)*.+/, (all, isDocuemnt) => {
          if (isDocuemnt) {
            documentLine = all;
          }
          return '';
        })
        .trim();

      if (!codeLine) {
        return;
      }

      const bIndex = chAlls.length;
      chAlls.push(...codeLine.split(''), EOL);
      const eIndex = chAlls.length;
      chLines.push([line, bIndex, eIndex, documentLine]);
    });

    // console.info(chAlls);
  }

  read() {
    if (this.isEOF) {
      throw Error('已经到达结尾');
    }
    return this.chAlls[this.chIndex++];
  }

  back() {
    return this.chAlls[--this.chIndex];
  }

  readLine() {
    if (this.isEOF) {
      throw Error('已经到达结尾');
    }
    const textLine = [];
    while (true) {
      const ch = this.read();
      if (ch === EOL) {
        break;
      } else {
        textLine.push(ch);
      }
    }

    return textLine.join('');
  }

  goto(chIndex: number) {
    this.chIndex = chIndex;
  }

  save() {
    this.indexStack.push(this.chIndex);
  }

  remove() {
    return this.indexStack.pop();
  }

  rollback() {
    this.goto(this.remove());
  }

  now() {
    return this.chAlls[this.chIndex];
  }

  text(bIndex: number, eIndex = bIndex + 100) {
    return this.chAlls
      .slice(bIndex, Math.min(this.chAlls.length, eIndex))
      .join('');
  }

  docLine(bIndex: number) {
    return this.info(bIndex).document;
  }

  info(index: number) {
    const lines = this.chLines;
    const linesLength = lines.length - 1;

    let bSection = 0;
    let eSection = linesLength;
    let nSection = bSection;
    let i = 1000; // 越界中断标识
    while (i--) {
      // nSection = Math.ceil((bSection + eSection) / 2)

      const item = lines[nSection]; // 二分法取值
      const bIndex = item[1];
      const eIndex = item[2];

      // console.info({ nSection, index, bIndex, eIndex })

      if (index >= bIndex && index < eIndex) {
        return {
          range: item.slice(1, 3) as [number, number],
          line: item[0], // 行
          column: index - bIndex + 1, // 列
          document: item[3], // 文档
        };
      }
      if (index < bIndex) {
        // 向前搜
        eSection = nSection;
        nSection = Math.floor((eSection + bSection) / 2); // 把当前值作为结束区间
      } else {
        // 向后搜
        bSection = nSection;
        nSection = Math.ceil((eSection + bSection) / 2); // 把当前值作为开始区间
      }
    }

    return null;
  }
}
