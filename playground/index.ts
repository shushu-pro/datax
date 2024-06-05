// eslint-disable-next-line import/no-extraneous-dependencies
import { js } from 'js-beautify';

import { DataX } from '../src';

// const result = DataX.getDocument(`
//   @id #guid /// + string kkk
// `);
// const result = DataX.getDocument(`
// @code #number
// @data{
//     @page 1
//     @pageSize 20
//     @dataList(20)[
//         @name #name
//         @age #number(1,20)
//         @address ['浙江', '北京', '上海']??
//         @email #email
//         @mobile #mobile
//         @avatar #img('100x100')
//         @books(2)[
//             @name ['三国演义', '水浒传']..
//             @price #decimal
//             @content #paragraph(2)
//             @onSale #bool
//         ]
//     ]
// }
// `);

// const source = `
// @a(:
//   @ b
// :)
// @dd 2232
// @list[

//   @kk{
//     @kkk (:
//       @ 77
//     :)
//   }
// ]
// `;
let source = '';
source = `
@code #number /// + string 状态码
@data{
  @page 1
  @pageSize 20
  @dataList(20)[
      @id 100++ /// number,null 数据ID
      @name #name
      @name2 @name + @page
      @age #number(1,20) /// number 年龄
      @address ['浙江', '北京', '上海']??
      @email #email
      @mobile #mobile
      @avatar #img('100x100')
      @books(2)[
        @name ['三国演义', '水浒传']..
        @price #decimal
        @content #paragraph(2)
        @onSale #bool
      ]
  ]
  @xo(: /// ? number 密密麻麻
    const kkk = 12
    @ 999   +kkk
  :)
  @ss[
    @name1 getName('name1')
    @name2 getName()
  ]
}

function getName(name = '#'){
  return name
}


`;

source = `
#id 12 /// number 商品id
#body{
  #id 2
  #ooo #name
}
#a{
  #b 2
}
#header{
  // #token 999
}

$log($body,$query,$header)

$log('@payload',$payload)
$log($body)
const kk = 1;
@kkkkk{
  @kk{
    @kkk 9
  }
}
@aa $payload.id
@$b_b 2
`;

// const code = DataX.getCode(source);

// console.info(code);

// try {
//   // eslint-disable-next-line no-new-func
//   Function(code);
// } catch (err) {
//   console.info(err);
// }

const { error: codeError, code } = DataX.getCode(source);

document.body.innerHTML =
  `<pre style="border:1px solid #eee;padding:8px;"><code>${source}</code></pre>` +
  `<pre style="border:1px solid #eee;padding:8px;"><code>${js(
    codeError ? '' : code
  )}</code></pre>`;

if (codeError) {
  console.info(codeError);
} else {
  const result = DataX.getDocument(source);

  const result2 = DataX.getJSON(source, {
    id: 999,
    // $body: { a: 2 },
    // $query: { aaa: 2 },
    // $header: { token: 'aaa' },
  });

  console.info({ result, result2 });
}

// Payloads: ['$body', '$header', '$query']

// const { error, data } = DataX.getJSON(source);
// const { error, docList } = DataX.getDocument(source);

// console.log({ error, docList });
// const kk = document.createElement('script');
// kk.textContent = `console.info('hello')`;

// document.body.appendChild(kk);

// // const result = js(code);

// console.info(result);

// getDebugger()

async function getDebugger(code) {
  // 浏览器上使用Web Worker进行分析
  if (window && window.Worker) {
    const blob = new Blob([code], { type: 'text/javascript' });
    const worker = new Worker(window.URL.createObjectURL(blob));

    return new Promise((resolve, reject) => {
      worker.onerror = (err) => {
        reject(err);
      };
      worker.onmessage = ({ data }) => {
        resolve(data);
      };
    });
  }
  return null;
}

// getDebugger(code)
//   .then((data) => {
//     // ..
//   })
//   .catch((err) => {
//     console.info('@@@', err.lineno, err.colno);
//   });
