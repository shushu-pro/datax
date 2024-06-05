const parserRegexp = RegExp(
  [
    /^\/\/\/+\s+/, // beginToken
    /(?:([-+?!])\s+)?/, // matchFlag
    /((\[)[\w,\s]+\]|[\w,]+)\s+/, // matchTypes, isMulti
    /(.+)/, // matchDescription
  ]
    .map((item) => item.source)
    .join('')
);

const shortTypes = {
  n: 'null',
  s: 'string',
  l: 'long',
  f: 'float',
  b: 'boolean',
  a: 'array',
  m: 'map',
};

export function docParser(docLine: string) {
  if (!docLine) {
    return null;
  }

  let flag: string; // 文档操作类型：{'+':'新增的', '-':'删除的', '?':'存在疑问的', '!':'建议修改的'}
  let types: Array<keyof typeof shortTypes> = []; // 字段数据类型
  let description: string; // 字段描述
  docLine.replace(
    parserRegexp,
    (all, matchFlag, matchTypes, isMulti, matchDescription) => {
      flag = matchFlag || null;
      types = (isMulti ? matchTypes.slice(1, -1) : matchTypes)
        .split(/,\s*/)
        .map((el) => shortTypes[el] || el);
      description = matchDescription
        .replace(/\\/g, '\\\\')
        .replace(/"/g, '\\"');
      return '';
    }
  );

  return { flag, types, description };
}
