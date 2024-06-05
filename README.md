# shushu.pro/datax

高效，简洁的 json 数据生成引擎。

### 引擎的优点

- 语法简洁，使用原始 json 结构，简化 json 的引号，逗号
- 支持批量生成数据，使用`(n)[ 数据  ]`指令批量生成 n 条数据
- 支持动态运算，值可以是 js 表达式
- 支持 mock 运算，值的表达式中可以使用 mock 指令生成数据
- 支持动态引用，值的表达式可以引用上级字段的值
- 支持读取外部变量，允许读取环境中的 js 变量（使得 mock 接口可以根据请求参数返回不同的数据）
- 支持嵌入执行原生 js 代码
- 支持导出字段文档描述

### demo

https://shushu-pro.github.io/datax/

### 安装使用

```
yarn add @shushu.pro/datax
```

```js
import DataX from '@shushu.pro/datax';

const data = DataX.getJSON(
  `
    @data{
        @name '张三',
        @age $param.age
    }
`,
  { $param: { age: 18 } }
);
// 返回：{ data: { name: '张三', age: 18 } }
```

### 简单示例

#### 示例代码

```
@data{
    @name '张三'
    @age 18
    @books(2)[
        @name '书名'+ 1++
        @price #decimal
    ]
}
```

#### 返回数据

```json
{
  "data": {
    "name": "张三",
    "age": 18,
    "books": [
      {
        "name": "书名1",
        "price": "1.87"
      },
      {
        "name": "书名2",
        "price": "1.87"
      }
    ]
  }
}
```

### 语法

#### 定义字段

- 空值返回字段
  ```
  @key /// => {"key":null}
  ```
- js 表达式返回字段
  ```
  @key Math.max(1, 6) /// => {"key":6}
  ```
- mock 指令返回字段，mock 指令详见：@smartx/mock-value
  ```
  @key #name // => {"key":"李虎"} 返回随机姓名
  ```
- 动态引用其他字段，同名字段覆盖上级字段

  ```
  @data1{
    @id 1
    @name 'aa'
    @list(2)[
      @id2 @id+1 // 返回2
      @name2 @name+'99' // 返回"aa99"
    ]
  }
  ```

> 定义字段使用`@字段名 字段值`，`字段值`可以是表达式，可以读取外部环境

> mock 指令可以使用`#指令`，`#指令(参数)`或者`$mock.指令(参数)`

> 动态引用变量使用`@变量`来应用，假如引用的变量是一个对象，则会形成循环引用，需要注意，引用对象的子字段使用`@变量.变量`，支持多级，同名字段下面的覆盖上面的值

#### 批量生成数据

```
const dataLength = 3
@data(dataLength)[ // 生成3条数据
  @id 1++
  @names(10)[ // 生成10条数据
    @name #name
  ]
]

// => {
  data: [
    {
      id:1,
      names: [
        {name:'张三'},
        {name:'李四'},
        {name:'王五'},
        ... // 剩余 7 条数据
      ]
    },
    ... // 剩余 2 条数据
  ]
}

```

> 使用`@key(n)[ @key1  @key2 ... ]`批量生成`n`条数据，相对于 map 格式，仅仅是添加`(n)`以及`{ }`变成`[ ]`

### 使用环境变量

#### 读取外部变量

```
// 接口请求 url：apiUrl?id=123&name=张三

const {id, name} = $query // 读取请求的参数

@data{
  @id id
  @name name
}
// => {"data":{ "id":123,"name":"张三" }}
```

> 引擎支持读取内部变量和外部传入的变量

#### 使用$exports

```
@data 1
$exports.data = 2 // 重写 data 变量
@data2 $exports.data + 1 // 读取 data 变量

// => {data:2, data2:3}
```

> $exports 为内部变量，是当前导出数据的引用，支持读写操作

### 嵌入原生 js

```datax
@data{
  @name1 getName()
  @name2 getName(true)
}

const num = false

if(num){
  @data{
    @num 777
  }
}

@data2{
  @value(: // 嵌套运算块，以@标识符返回值，赋值给当前字段
    const arr = []
    for(let i = 0;i < 10; i++){
      arr.push('数据'+i)
    }
    @ arr
  :)
}

function getName(type){
  return type ? '具名':'匿名'
}
```

> 引擎支持嵌套 js 运算，支持调用环境中的函数，也支持内部直接嵌套运算块

### 定义文档

```
@data{ /// + object 返回的数据
  @code /// enmu 返回的状态码{0:'正确', 1:'登录异常', 2:'参数错误'}
  @list(8)[
    @name /// string 名称
    @age /// integer,null 年龄
  ]
}
```

### 获取文档

```ts
import { DataX } from '@shushu.pro/datax';

DataX.getDocument(`
  @code 0 /// enum 状态码,(0:正确，6:参数错误，7:路径错误)
  @data{ /// object 响应数据
    @name #name /// string 用户名称
  }
`);
```

> 定义字段文档使用`@key`末尾跟随`/// [updateType] <dataType> <description>`

- updateType 为字段变更类型，可选配置项，取值{+:'新增的',-:'删除的','?':'存在疑问的'}
- dataType 为字段可取的数据类型，string,number,boolean 等，多种类型用逗号隔开，可选添加`null`即可
- description 为字段的描述
