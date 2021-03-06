import DataX from '../src/index'
import jsBeautify from 'js-beautify'
// https://github.com/abodelot/jquery.json-viewer


const code1 = `
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
`.trim()

const code = code1

$('#codeEditor').val(code)

updateJSON(code)

$('#codeEditor').on('keydown', function (e) {
  if (e.keyCode === 9) {
    e.preventDefault()
    var indent = '    '
    var start = this.selectionStart
    var end = this.selectionEnd
    var selected = window.getSelection().toString()
    selected = indent + selected.replace(/\n/g, `\n${indent}`)
    this.value = this.value.substring(0, start) + selected + this.value.substring(end)
    this.setSelectionRange(start + indent.length, start + selected.length)
  } else {
    setTimeout(() => updateJSON(this.value), 100)
  }
})


let timer = null
function updateJSON (code) {
  clearTimeout(timer)
  timer = setTimeout(() => {
    const t1 = Date.now()
    const interpreter = DataX.compile(code)

    const data = interpreter.execute()

    const cost = Date.now() - t1
    $('#cost').text(`执行耗时：${cost}ms`)
    if (enabled) {
      $('#jsonViwer').jsonViewer(data, { rootCollapsable: true, collapsed: !true, withQuotes: true, withLinks: true })
    } else {
      console.warn(data)
    }
    if (typeof document !== 'undefined' && interpreter.code) {
      document.getElementById('jscode').innerHTML =
       `<textarea 
        style="width:100%; height:1000px; margin-top:20px" autocomplete="off"
        >${jsBeautify.js(interpreter.code)}</textarea>`.trim()
    }
  }, 1000)
}

let enabled = true

$('#btn').click(function () {
  enabled = !enabled
  this.innerHTML = enabled ? '禁用' : '启用'
})
