import * as mockv from '@shushu.pro/mockv';

const valueTransform = [
  stepNumTransform,
  stepValueTransform,
  thisFieldTransform,
  randomValueTransform,
  mockValueTransform,
];

// 累加取值
function stepNumTransform(code: string) {
  const matches = code.match(/(\d+)(\+\+|--)/);
  if (!matches) {
    return null;
  }
  const [, num, type] = matches;
  const step = type === '++' ? 1 : -1;
  return {
    nextCode: `${Number(num) - step} + this.$total * ${step}`,
    isBreak: true,
  };
}

// 数组项取值
function stepValueTransform(code: string) {
  const matches = code.match(/([^.]+)?\.\.(?:\s+|$)/);
  if (!matches) {
    return null;
  }
  const [, expression] = matches;
  return {
    nextCode: `${expression}[this.$index]`,
    isBreak: true,
  };
}

// this转化
function thisFieldTransform(code: string) {
  // 跳过所有的字符串内容
  const nextCode = code.replace(
    /(?:'(?:[^']|\\\\|\\')')|(?:"(?:[^"]|\\\\|\\")")|(?:`(?:[^`]|\\\\|\\`)`)|(@)/g,
    (all, thisSymbol) => {
      if (thisSymbol) {
        return 'this.';
      }
      return all;
    }
  );
  if (code === nextCode) {
    return null;
  }
  return {
    nextCode,
    isBreak: false,
  };
}

// 随机数取值
function randomValueTransform(code: string) {
  const matches = code.match(/(.+)?\?\?/);
  if (!matches) {
    return null;
  }
  const [, expression] = matches;
  return {
    nextCode: `$mock.random(${expression})`,
    isBreak: true,
  };
}

// mock转化
function mockValueTransform(code: string) {
  const matches = code.match(/^#(\w+[.\w]*)\s*(\(.+)?/);
  if (!matches) {
    return null;
  }

  const [, command, args] = matches;
  if (command in mockv) {
    return {
      nextCode: `$mock.${command}${args || '()'}`,
      isBreak: true,
    };
  }
  return {
    nextCode: `"${command}${args ? args.replace(/"/g, '\\"') : '()'}"`,
    isBreak: false,
  };
}

export default function transformValueExpression(code: string) {
  for (let i = 0, lg = valueTransform.length; i < lg; i++) {
    const result = valueTransform[i](code);

    // 返回对象，则进行转化操作
    if (result != null) {
      const { nextCode, isBreak } = result;
      if (nextCode !== undefined) {
        code = nextCode;
      }
      if (isBreak) {
        break;
      }
    }
  }

  return code;
}
