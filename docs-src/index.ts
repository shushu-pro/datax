// import jsBeautify from 'js-beautify';

import { DataX } from '../src';

const code = `
@code #number
@data{
    @page 1
    @pageSize 20
    @dataList(20)[
        @name #name
        @age #number(1,20)
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
}
`.trim();

let enabled = true;
let timer = null;
function updateJSON(code) {
  clearTimeout(timer);
  timer = setTimeout(() => {
    const t1 = Date.now();
    const interpreter = DataX.compile(code);

    const result = interpreter.getJSON();

    const cost = Date.now() - t1;
    $('#cost').text(`执行耗时：${cost}ms`);
    if (enabled) {
      $('#jsonViwer').jsonViewer(result.error || result.data, {
        rootCollapsable: true,
        collapsed: !true,
        withQuotes: true,
        withLinks: true,
      });
    } else {
      console.warn(result);
    }
    // if (typeof document !== 'undefined' && interpreter.getCode()) {
    //   document.getElementById('jscode').innerHTML = `<textarea
    //     style="width:100%; height:1000px; margin-top:0px" autocomplete="off"
    //     >${jsBeautify.js(interpreter.getCode())}</textarea>`.trim();
    // }
  }, 1000);
}

$('#codeEditor').val(code);
updateJSON(code);

$('#btn').on('click', function () {
  enabled = !enabled;
  if (enabled) {
    this.innerHTML = '关闭更新JSONTree';
    $('#jsonViwer').css('opacity', 1);
  } else {
    this.innerHTML = '开启更新JSONTree';
    $('#jsonViwer').css('opacity', 0.1);
  }
});

$('#codeEditor').on('keydown', function (e) {
  const text = this as HTMLTextAreaElement;

  if (e.key === 'Tab') {
    e.preventDefault();
    const indent = '    ';
    const start = text.selectionStart;
    const end = text.selectionEnd;
    let selected = window.getSelection().toString();
    selected = indent + selected.replace(/\n/g, `\n${indent}`);
    text.value =
      text.value.substring(0, start) + selected + text.value.substring(end);
    text.setSelectionRange(start + indent.length, start + selected.length);
  } else {
    setTimeout(() => {
      updateJSON(text.value);
    });
  }
});
