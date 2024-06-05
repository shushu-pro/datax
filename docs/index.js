!function(e){"use strict";function t(e){var t=Object.create(null);return e&&Object.keys(e).forEach((function(n){if("default"!==n){var r=Object.getOwnPropertyDescriptor(e,n);Object.defineProperty(t,n,r.get?r:{enumerable:!0,get:function(){return e[n]}})}})),t.default=e,Object.freeze(t)}var n=t(e);function r(e,t,n,r,i){var o={};return Object.keys(r).forEach((function(e){o[e]=r[e]})),o.enumerable=!!o.enumerable,o.configurable=!!o.configurable,("value"in o||o.initializer)&&(o.writable=!0),o=n.slice().reverse().reduce((function(n,r){return r(e,t,n)||n}),o),i&&void 0!==o.initializer&&(o.value=o.initializer?o.initializer.call(i):void 0,o.initializer=void 0),void 0===o.initializer&&(Object.defineProperty(e,t,o),o=null),o}function i(e,t,n){return t&&function(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,a(r.key),r)}}(e.prototype,t),Object.defineProperty(e,"prototype",{writable:!1}),e}function o(e,t){e.prototype=Object.create(t.prototype),e.prototype.constructor=e,c(e,t)}function c(e,t){return c=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(e,t){return e.__proto__=t,e},c(e,t)}function a(e){var t=function(e,t){if("object"!=typeof e||!e)return e;var n=e[Symbol.toPrimitive];if(void 0!==n){var r=n.call(e,t);if("object"!=typeof r)return r;throw new TypeError("@@toPrimitive must return a primitive value.")}return String(e)}(e,"string");return"symbol"==typeof t?t:t+""}var u=function(){},s=function(){function e(e){var t=this.chAlls=[],n=this.chLines=[];this.indexStack=[],this.chIndex=0;var r=0;e.split(/\r\n?|\r?\n/).forEach((function(e){r++;var i,o=e.trim();if(o&&(o=o.replace(/\/\/(\/)*.+/,(function(e,t){return t&&(i=e),""})).trim())){var c=t.length;t.push.apply(t,o.split("").concat(["\n"]));var a=t.length;n.push([r,c,a,i])}}))}var t=e.prototype;return t.read=function(){if(this.isEOF)throw Error("已经到达结尾");return this.chAlls[this.chIndex++]},t.back=function(){return this.chAlls[--this.chIndex]},t.readLine=function(){if(this.isEOF)throw Error("已经到达结尾");for(var e=[];;){var t=this.read();if("\n"===t)break;e.push(t)}return e.join("")},t.goto=function(e){this.chIndex=e},t.save=function(){this.indexStack.push(this.chIndex)},t.remove=function(){return this.indexStack.pop()},t.rollback=function(){this.goto(this.remove())},t.now=function(){return this.chAlls[this.chIndex]},t.text=function(e,t){return void 0===t&&(t=e+100),this.chAlls.slice(e,Math.min(this.chAlls.length,t)).join("")},t.docLine=function(e){return this.info(e).document},t.info=function(e){for(var t=this.chLines,n=0,r=t.length-1,i=n,o=1e3;o--;){var c=t[i],a=c[1],u=c[2];if(e>=a&&e<u)return{range:c.slice(1,3),line:c[0],column:e-a+1,document:c[3]};e<a?(r=i,i=Math.floor((r+n)/2)):(n=i,i=Math.ceil((r+n)/2))}return null},i(e,[{key:"notEOF",get:function(){return this.chIndex<this.chAlls.length}},{key:"isEOF",get:function(){return!this.notEOF}}])}();s.EOL="\n";var l,d=function(){function e(){}var t=e.prototype;return t.run=function(e,t){return{error:Error(""),data:null}},t.doc=function(e){return{error:Error(""),docList:[]}},e}(),h=function(){function e(){this.m=this.n=1}return e.prototype.suffix=function(e,t){this.m=e,this.n=t},e}(),f=function(e){function t(){return e.apply(this,arguments)||this}return o(t,e),t}(h),p=function(e){function t(){return e.apply(this,arguments)||this}o(t,e);var n=t.prototype;return n.scan=function(e){var t=this.orHead,n=t.firstChild;n.scan(e.createChildRuntime(this,{tempOrChild:t,tempAndChild:n,tempSuccessChildren:[]}))},n.childSuccess=function(e){var t=e.parent;t.tempLastChild?(t.tempLastChild.nextSibling=e,t.tempLastChild=e):t.tempFirstChild=t.tempLastChild=e;var n=t.tempAndChild;n.nextSibling?(n=t.tempAndChild=n.nextSibling).scan(t):(t.tempSuccessChildren.push({firstChild:t.tempFirstChild,lastChild:t.tempLastChild}),t.matches++,t.tempFirstChild=t.tempLastChild=null,t.matches<this.n?(t.tempOrChild=this.orHead,t.tempAndChild=this.orHead.firstChild,t.tempAndChild.scan(t)):this.collectRuntimes(t))},n.childFailure=function(e,t){var n=e.parent,r=n.tempFirstChild&&n.tempFirstChild.bIndex<n.tempLastChild.eIndex;if(r&&(n.cr.goto(n.tempFirstChild.bIndex),n.tempFirstChild=n.tempLastChild=null),n.tempOrChild.nextSibling&&!t.matchStop)(!n.tempError||n.tempError.bIndex<=t.bIndex)&&(n.tempError=t),n.tempOrChild=n.tempOrChild.nextSibling,n.tempAndChild=n.tempOrChild.firstChild,n.tempAndChild.scan(n);else if(n.matches<this.m||r&&t.matchStop){var i=n.tempError;n.reject({bIndex:(i&&i.bIndex>t.bIndex?i:t).bIndex,partialMatched:r})}else this.collectRuntimes(n)},n.putOr=function(){this.curAnd=null},n.putAnd=function(e){var t=this.curOr,n=this.curAnd;this.orHead?n?n.nextSibling=e:t.nextSibling=this.curOr={firstChild:e}:this.orHead=this.curOr={firstChild:e},this.curAnd=e},n.putEnd=function(e){void 0===e&&(e=""),delete this.curOr,delete this.curAnd,this.debugSource=e},n.collectRuntimes=function(e){for(var t,n=0;n<e.tempSuccessChildren.length;n++){var r=e.tempSuccessChildren[n],i=r.firstChild,o=r.lastChild;t?(t.nextSibling=i,t=e.lastChild=o):(e.firstChild=i,t=e.lastChild=o)}delete e.tempSuccessChildren,delete e.tempFirstChild,delete e.tempLastChild,e.resolve()},n.showDebugChildren=function(){for(var e=[],t=this.orHead;t;){for(var n=[],r=t.firstChild;r;)n.push(r),r=r.nextSibling;e.push(n),t=t.nextSibling}this.debugChildren=e,delete this.orHead},t}(f),v=function(e){function t(t){var n;return(n=e.call(this)||this).id=t,n}o(t,e);var n=t.prototype;return n.scan=function(e){e.getMatcher(this.id).scan(e.createChildRuntime(this))},n.childSuccess=function(e){var t=e.parent;t.matches++,t.appendChild(e),t.matches<this.n?t.getMatcher(this.id).scan(t):t.resolve()},n.childFailure=function(e,t){var n=e.parent;n.matches<this.m||t.partialMatched&&this.disableBacktrack?n.reject(t):n.resolve()},t}(f),m=function(e){function t(t,n){var r;return void 0===n&&(n=""),(r=e.call(this)||this).match=t,r.debugId=n,r}return o(t,e),t.prototype.scan=function(e){var t=e.createChildRuntime(this),n=t.cr,r=n.chIndex;n.save(),this.match(n)?(n.remove(),t.resolve(r,n.chIndex)):(n.rollback(),t.reject({bIndex:r}))},t}(h),y=function(e){function t(t){var n;return(n=e.call(this)||this).source=t,n}o(t,e);var n=t.prototype;return n.scan=function(e){var t=e.createChildRuntime(this),n=t.cr,r=this.m,i=this.n,o=n.chIndex,c=!1;n.save();for(var a=0;a<r;a++){if(!this.match(n))return n.rollback(),void t.reject({bIndex:o,partialMatched:c});c=!0}n.remove();for(var u=r;u<i;u++){if(n.save(),!this.match(n)){n.rollback();break}n.remove()}t.resolve(o,n.chIndex)},n.match=function(e){for(var t=this.source,n=0,r=t.length;n<r;n++)if(e.read()!==t[n])return!1;return!0},t}(h),x=RegExp([/\s+/,/'((?:[^']|\\\\|\\')+)'/,/<([^>]+)>/,/(\()/,/(\))/,/([?*+]|\{\d+\}|\{\d+,(?:\d+)?\}|\{,\d+\})/,/(!)/,/(\|)/,/(.)/].map((function(e){return e.source})).join("|"),"g"),b=function(e){function t(t,n){var r,i=t.match,o=t.enter,c=t.leave,a=t.document;return(r=e.call(this)||this).debugId=n,r.hooks={enter:o,leave:c,document:a},r.matcher=r.parseMatch(i),r}o(t,e);var n=t.prototype;return n.scan=function(e){this.matcher.scan(e.createChildRuntime(this))},n.childSuccess=function(e){var t=e.parent;t.matches++,t.appendChild(e),t.matches<this.n?this.matcher.scan(t):t.resolve()},n.childFailure=function(e,t){var n=e.parent;n.matches<this.m?n.reject(t):n.resolve()},n.parseMatch=function(e){if("function"==typeof e)return new m(e);var t=e,n=x,r=[],i=[],o=new p,c=o,a=c;return e.replace(n,(function(e,n,o,u,s,l,d,h,f,m){switch(!1){case!u:var x=new p;c.putAnd(x),i.push(c),a=c=x,r.push(m);break;case!s:a=c,c.putEnd(t.slice(r.pop(),m+1)),c=i.pop();break;case!h:c.putOr();break;case!l:!function(e){switch(e){case"?":a.suffix(0,1);break;case"*":a.suffix(0,1/0);break;case"+":a.suffix(1,1/0);break;default:var t=e.slice(1,-1).split(",").map((function(e){return Number(e)}));1===t.length?a.suffix(t[0],t[0]):a.suffix(t[0]||0,t[1]||1/0)}}(l);break;case!d:a.disableBacktrack=!0;break;case!o:c.putAnd(a=new v(o));break;case!n:c.putAnd(a=new y(n))}return""})),o.putEnd(t),o},t}(f),g=function(){function e(e){this.allMatchers={},this.initBuiltinMatchers(),this.initHookMatchers(e.matchers)}var t=e.prototype;return t.add=function(e,t){this.allMatchers[e]=new b(t,e)},t.initBuiltinMatchers=function(){var e=this.allMatchers;[["w",function(e){return/\w/.test(e.read())}],["W",function(e){return/\W/.test(e.read())}],["d",function(e){return/\d/.test(e.read())}],["D",function(e){return/\D/.test(e.read())}],["s",function(e){return/\s/.test(e.read())}],["S",function(e){return/\S/.test(e.read())}],["eol",function(e){return e.read()===s.EOL}],[".",function(e){return e.read()!==s.EOL}]].forEach((function(t){var n=t[0],r=t[1];e[n]=new m(r,n)}))},t.initHookMatchers=function(e){var t=this;e&&Object.keys(e).forEach((function(n){t.add(n,e[n])}))},i(e,[{key:"matchers",get:function(){return this.allMatchers}}])}(),C=function(e){function t(){var t;return(t=e.call(this)||this).runtimes=[],t}o(t,e);var n=t.prototype;return n.scan=function(e){var t=e.cr;try{for(;t.notEOF;)e.getMatcher("Main").scan(e)}catch(e){var n=e.bIndex,r=t.info(n),i=t.text.apply(t,r.range),o=i.slice(0,r.column-1)+" ┋ "+i.slice(r.column-1);this.error={message:e.message,line:r.line,column:r.column,lineText:o}}return{error:this.error,runtimes:this.runtimes}},n.childSuccess=function(e){this.runtimes.push(e)},n.childFailure=function(e,t){throw t},t}(f),N=(l=function(){function e(e,t,n){this.parent=e,this.matcher=t,this.data=n,this.matches=0,e&&(this.cr=e.cr,this.matchers=e.matchers),n&&Object.assign(this,n)}var t=e.prototype;return t.createChildRuntime=function(t,n){return new e(this,t,n)},t.appendChild=function(e){this.lastChild?(this.lastChild.nextSibling=e,e.previousSibling=this.lastChild,this.lastChild=e):this.firstChild=this.lastChild=e},t.getMatcher=function(e){return this.matchers[e]},t.resolve=function(e,t){null!=t?(this.bIndex=e,this.eIndex=t):this.firstChild?(this.bIndex=this.firstChild.bIndex,this.eIndex=this.lastChild.eIndex):(this.bIndex=this.cr.chIndex,this.eIndex=this.cr.chIndex),this.parent.matcher.childSuccess(this)},t.reject=function(e){e.partialMatched&&!this.matcher.disableBacktrack&&(e.matchStop=!0),this.parent.matcher.childFailure(this,e)},e}(),r(l.prototype,"resolve",[w],Object.getOwnPropertyDescriptor(l.prototype,"resolve"),l.prototype),r(l.prototype,"reject",[w],Object.getOwnPropertyDescriptor(l.prototype,"reject"),l.prototype),l);function w(e,t,n){var r,i,o=n.value,c=!1;n.value=function(){r=this;for(var e=arguments.length,t=new Array(e),n=0;n<e;n++)t[n]=arguments[n];if(i=t,!c)try{for(c=!0;i;){var a=i;i=null,o.apply(r,a)}}finally{c=!1}}}var E=function(){function e(e){this.matcherContainer=new g({matchers:e.matchers}),this.Builder=e.Builder,this.Explainer=e.Explainer}var t=e.prototype;return t.addMatcher=function(){var e;(e=this.matcherContainer).add.apply(e,arguments)},t.compile=function(e){var t,n=this,r=new s(e),i=new C,o=new N(null,i,{cr:r,matchers:this.matcherContainer.matchers}),c=i.scan(o),a=c.error,u=c.runtimes,l=function(){return t||(t=new n.Builder).build(u),t},d=new this.Explainer;return{error:a,getJSON:function(e){return void 0===e&&(e={}),a?{error:a,data:null}:d.run(l().code(),e)},getDocument:function(){return a?{error:a,docList:null}:d.doc(l().tree())},getCode:function(){return a?{error:a,code:null}:{error:null,code:l().code()}}}},e}(),k=[function(e){var t=e.match(/(\d+)(\+\+|--)/);if(!t)return null;var n=t[1],r="++"===t[2]?1:-1;return{nextCode:Number(n)-r+" + this.$total * "+r,isBreak:!0}},function(e){var t=e.match(/([^.]+)?\.\.(?:\s+|$)/);if(!t)return null;return{nextCode:t[1]+"[this.$index]",isBreak:!0}},function(e){var t=e.replace(/(?:'(?:[^']|\\\\|\\')')|(?:"(?:[^"]|\\\\|\\")")|(?:`(?:[^`]|\\\\|\\`)`)|(@)/g,(function(e,t){return t?"this.":e}));if(e===t)return null;return{nextCode:t,isBreak:!1}},function(e){var t=e.match(/(.+)?\?\?/);if(!t)return null;return{nextCode:"$mock.random("+t[1]+")",isBreak:!0}},function(e){var t=e.match(/^#(\w+[.\w]*)\s*(\(.+)?/);if(!t)return null;var r=t[1],i=t[2];if(r in n)return{nextCode:"$mock."+r+(i||"()"),isBreak:!0};return{nextCode:'"'+r+(i?i.replace(/"/g,'\\"'):"()")+'"',isBreak:!1}}];function O(e){for(var t=0,n=k.length;t<n;t++){var r=k[t](e);if(null!=r){var i=r.nextCode;if(void 0!==i&&(e=i),r.isBreak)break}}return e}var L=function(){function e(e){this.builder=e,this.prevNode=e.curNode}var t=e.prototype;return t.doc=function(){throw Error("Node.doc must be override")},t.code=function(){throw Error("Node.code must be override")},e}(),j=function(e){function t(t){var n;return(n=e.call(this,t)||this).fields=[],n}o(t,e);var n=t.prototype;return n.codeFields=function(){return this.fields.map((function(e){return e.code()})).join("\n")},n.codeKeys=function(){var e=[];return this.fields.forEach((function(t){t.fieldValueExpression||t.childNode||e.push(t.fieldKey)})),e.join(", ")},n.docFields=function(){return this.fields.map((function(e){return e.doc()})).join("\n")},t}(L),F=function(e){function t(){return e.apply(this,arguments)||this}o(t,e);var n=t.prototype;return n.code=function(){var e=this.codeFieldKey(),t=this.fieldValueExpression,n=this.childNode;return'$field("'+e+'", function(){\n      '+(t?"$value(function(){\n        return "+O(t)+"\n      });":n?n.code():"$value(function(){\n        return this."+e+"\n      });")+"\n    });"},n.codeFieldKey=function(){return this.fieldKey.replace(/[^.]+\./,"")},t}(L),S=function(e){function t(){for(var t,n=arguments.length,r=new Array(n),i=0;i<n;i++)r[i]=arguments[i];return(t=e.call.apply(e,[this].concat(r))||this).type="map",t}return o(t,e),t.prototype.code=function(){return"$map(function(){\n      "+this.codeFields()+"\n    });"},t}(j),D=function(e){function t(){for(var t,n=arguments.length,r=new Array(n),i=0;i<n;i++)r[i]=arguments[i];return(t=e.call.apply(e,[this].concat(r))||this).type="list",t}return o(t,e),t.prototype.code=function(){var e=this.prevNode,t=this.childNode,n=t?t.code():"$map(function(){\n        "+this.codeFields()+"\n      });";return"$list("+(e.listLength||10)+", function(){\n      "+n+"\n    });"},t}(j),I=function(e){function t(){return e.apply(this,arguments)||this}return o(t,e),t.prototype.code=function(){return"$value(function(){\n      "+(this.blockExpressions?this.blockExpressions.join(""):"")+"\n      return "+this.returnExpression+"\n    });"},t}(j),M=function(e){function t(){return e.apply(this,arguments)||this}return o(t,e),t.prototype.code=function(){return this.codeExpression},t}(L),A=function(e){function t(){for(var t,n=arguments.length,r=new Array(n),i=0;i<n;i++)r[i]=arguments[i];return(t=e.call.apply(e,[this].concat(r))||this).type="pfield",t}o(t,e);var n=t.prototype;return n.code=function(){var e=this.codeFieldKey(),t=this.fieldValueExpression,n=this.childNode;return'$pfield("'+e+'", function(){\n      '+(t?"$value(function(){\n        return "+O(t)+"\n      });":n?n.code():"$value(function(){\n        return this."+e+"\n      });")+"\n    });"},n.codeFieldKey=function(){return this.fieldKey.replace(/[^.]+\./,"")},t}(L),P=function(e){function t(){var t;return(t=e.call(this)||this).createRoot(),t}o(t,e);var n=t.prototype;return n.addField=function(){this.curNode=this.fieldNode=new F(this)},n.setFieldKey=function(e){this.fieldNode.fieldKey=e},n.setFieldValueExpression=function(e){this.fieldNode.fieldValueExpression=e},n.setListLength=function(e){/^\d+$/.test(e)||/^[$\w.]+$/.test(e)||(e="0"),this.fieldNode.listLength=e},n.addDone=function(){var e=this.curNode,t=e.prevNode;t.fields?t.fields.push(e):t.childNode=e,this.curNode=t},n.addMap=function(){this.curNode=new S(this)},n.addList=function(){this.curNode=this.listNode=new D(this)},n.addValue=function(){this.curNode=this.valueNode=new I(this)},n.addValueBlockExpression=function(e){this.valueNode.blockExpressions||(this.valueNode.blockExpressions=[]),this.valueNode.blockExpressions.push(e)},n.setValueReturnExpression=function(e){this.valueNode.returnExpression=e},n.addJs=function(){this.curNode=this.jsNode=new M(this)},n.setJsCodeExpression=function(e){this.jsNode.codeExpression=e},n.addDocLine=function(e){this.fieldNode.docLine=e},n.addPayloadField=function(){this.curNode=this.fieldNode=new A(this)},n.code=function(){return this.rootNode.code()},n.tree=function(){return this.rootNode},n.build=function(e){var t=this;e.forEach((function e(n){if(n){var r=n.cr,i=n.matcher.hooks,o=i?r.text(n.bIndex,n.eIndex):null;null==i||null==i.enter||i.enter(t,o),null==i||null==i.document||i.document(t,r.docLine(n.bIndex)),n.firstChild&&e(n.firstChild),null==i||null==i.leave||i.leave(t,o),n.nextSibling&&e(n.nextSibling)}}))},n.createRoot=function(){this.rootNode=this.curNode=new S(this)},t}(u),V=RegExp([/^\/\/\/+\s+/,/(?:([-+?!])\s+)?/,/((\[)[\w,\s]+\]|[\w,]+)\s+/,/(.+)/].map((function(e){return e.source})).join("")),B={n:"null",s:"string",l:"long",f:"float",b:"boolean",a:"array",m:"map"};var R=function(e){function t(){return e.apply(this,arguments)||this}o(t,e);var r=t.prototype;return r.run=function(e,t){try{var n=this.createContext(t),r=n.ctx,i=n.apply,o=Object.keys(r);return Function(o.join(","),e).apply(void 0,o.map((function(e){return r[e]}))),i(),{error:null,data:r.$exports}}catch(e){return{error:e,data:null}}},r.doc=function(e){for(var t,n=[],r=[{node:e,docList:n}],i=function(){var e,n=t,i=n.node,o=n.docList;i.fieldKey&&(o.push(e=Object.assign({key:i.fieldKey,types:[],flag:null,description:null},function(e){if(!e)return null;var t,n,r=[];return e.replace(V,(function(e,i,o,c,a){return t=i||null,r=(c?o.slice(1,-1):o).split(/,\s*/).map((function(e){return B[e]||e})),n=a.replace(/\\/g,"\\\\").replace(/"/g,'\\"'),""})),{flag:t,types:r,description:n}}(i.docLine))),"pfield"!==i.type||i.prevNode.prevNode||(e.isPayload=!0)),i.fields?r.push.apply(r,i.fields.map((function(e){return{node:e,docList:o}}))):i.childNode&&(r.push({node:i.childNode,docList:e.children=[]}),"map"===i.childNode.type?e.types=["object"]:"list"===i.childNode.type&&(e.types=["array"]))};t=r.shift();)i();return{error:null,docList:n}},r.createContext=function(e){var t,r=Object.assign({},e),i={},o=Object.assign({},e.$body),c=Object.assign({},e.$query),a=Object.assign({},e.$header),u=["body","query","header"],s=null,l={$payload:r,$exports:i,$body:o,$query:c,$header:a,$mock:n,$map:function(e){t?H.explain(t,e):s=(t={curNode:null}).curNode=new H(t,e)},$field:function(e,n){var r=t.curNode;r===s?i[e]=T.explain(t,e,n).value(t):T.explain(t,e,n),t.curNode=r},$value:function(e){_.explain(t,e)},$list:function(e,n){z.explain(t,n,e)},$pfield:function(e,n){var i=t.curNode;if(i===s){var o=q.explain(t,e,n).value(t);u.includes(e)?Object.assign(l["$"+e],Object.assign({},o,l["$"+e])):r[e]=o}else q.explain(t,e,n);t.curNode=i},$log:function(){var e;(e=console).warn.apply(e,arguments)}};return{apply:function(){t.curNode.value(t)},ctx:Object.assign({},e,l)}},t}(d),K=0,J=function(){function e(e,t){this.uuid=K++,this.parentNode=e.curNode,this.Context=function(){},this.context=this.Context.prototype=this.parentNode?new this.parentNode.Context:{},this.getter=t}var t=e.prototype;return t.getterProxy=function(e){e.curNode=this,e.curNode.getter.call(this.context,e),e.curNode=this.parentNode},t.appendChild=function(e){return this.childNode=e},t.value=function(e){throw Error("Node.value must be override by "+this.constructor.name+".value")},e}(),H=function(e){function t(t,n){var r;return(r=e.call(this,t,n)||this).fields={},r}o(t,e),t.explain=function(e,n){e.curNode.appendChild(new t(e,n))};var n=t.prototype;return n.appendChild=function(e){return this.fields[e.key]=e,e},n.value=function(e){this.getterProxy(e);var t={};for(var n in this.fields)e.curNode=this,t[n]=this.context[n]=this.fields[n].value(e),e.curNode=this.parentNode;return t},t}(J),T=function(e){function t(t,n,r){var i;return(i=e.call(this,t,r)||this).key=n,i}return o(t,e),t.explain=function(e,n,r){return e.curNode.appendChild(new t(e,n,r))},t.prototype.value=function(e){return this.getterProxy(e),this.childNode?this.childNode.value(e):null},t}(J),z=function(e){function t(t,n,r){var i;return(i=e.call(this,t,n)||this).arr=r,i.context.$total=0,i}return o(t,e),t.explain=function(e,n,r){e.curNode.appendChild(new t(e,n,r))},t.prototype.value=function(e){this.getterProxy(e),e.curNode=this;var t=[];if(!this.childNode)return t;if(Array.isArray(this.arr))for(var n=this.arr,r=0;r<n.length;r++)this.context.$index=r,this.context.$total++,Object.assign(this.context,n[r]),t.push(this.childNode.value(e));else for(var i=0;i<this.arr;i++)this.context.$index=i,this.context.$total++,t.push(this.childNode.value(e));return e.curNode=this.parentNode,t},t}(J),_=function(e){function t(){return e.apply(this,arguments)||this}return o(t,e),t.explain=function(e,n){return e.curNode.appendChild(new t(e,n))},t.prototype.value=function(e){var t=this.getter.call(this.context,e);return void 0===t?null:t},t}(J),q=function(e){function t(t,n,r){var i;return(i=e.call(this,t,r)||this).key=n,i}return o(t,e),t.explain=function(e,n,r){return e.curNode.appendChild(new t(e,n,r))},t.prototype.value=function(e){return this.getterProxy(e),this.childNode?this.childNode.value(e):null},t}(J),W={Main:{match:"<Field>! | <PayloadField>! | <JsExpression>!"},Field:{match:"\n      '@' <FieldKey>\n      (\n        <eol>! |\n        ( <s>+ ( <FieldValueExpression> ) )! |\n        ( '(' <s>* ')' )? <DataBlock>! |\n        ( '(' <DataListLength> ')' <DataList>! )\n      ) \n    ",enter:function(e){return e.addField()},leave:function(e){return e.addDone()},document:function(e,t){return e.addDocLine(t)}},FieldKey:{match:" ( <w> | '$' )+ ",leave:function(e,t){return e.setFieldKey(t)}},FieldValueExpression:{match:function(e){return!!e.readLine()},leave:function(e,t){return e.setFieldValueExpression(t)}},DataBlock:{match:"<DataMap>! | <DataList>! | <DataValue>!"},DataMap:{match:"\n      '{' <eol> \n          <Field>*! \n      '}' <eol> \n    ",enter:function(e){return e.addMap()},leave:function(e){return e.addDone()}},DataList:{match:"\n      '[' <eol>\n          <Field>*! \n      ']' <eol>\n    ",enter:function(e){return e.addList()},leave:function(e){return e.addDone()}},DataListLength:{match:" <d>+ | (<w> | '.' | '$')+ ",leave:function(e,t){return e.setListLength(t)}},DataValue:{match:"\n      '(:' <eol> \n        <DataValueBlockExpression>* \n        <DataValueReturnExpression> \n      ':)' <eol>?\n    ",enter:function(e){return e.addValue()},leave:function(e){return e.addDone()}},DataValueBlockExpression:{match:function(e){return!/^@|^:\)$/.test(e.readLine())},leave:function(e,t){return e.addValueBlockExpression(t)}},DataValueReturnExpression:{match:function(e){return/^@ /.test(e.readLine())},leave:function(e,t){return e.setValueReturnExpression(t.slice(2))}},JsExpression:{match:" <.>+ <eol> ",enter:function(e){return e.addJs()},leave:function(e,t){e.setJsCodeExpression(t),e.addDone()}},PayloadField:{match:"\n      '#' <FieldKey>\n      (\n        <eol>! |\n        ( <s>+ ( <FieldValueExpression> ) )! |\n        <PayloadDataMap>! |\n        <PayloadDataList>!\n      ) \n    ",enter:function(e){return e.addPayloadField()},leave:function(e){return e.addDone()},document:function(e,t){return e.addDocLine(t)}},PayloadDataMap:{match:"\n      '{' <eol>\n          <PayloadField>*! \n      '}' <eol>\n    ",enter:function(e){return e.addMap()},leave:function(e){return e.addDone()}},PayloadDataList:{match:"\n      '[' <eol>\n          <PayloadField>*! \n      ']' <eol>\n    ",enter:function(e){return e.addList()},leave:function(e){return e.addDone()}}},Q=function(){function e(){this.regexpEngine=new E({matchers:W,Builder:P,Explainer:R})}return e.getDocument=function(e){return G.compile(e).getDocument()},e.getJSON=function(e,t){return void 0===t&&(t={}),G.compile(e).getJSON(t)},e.getCode=function(e){return G.compile(e).getCode()},e.compile=function(e){return G.compile(e)},e.prototype.compile=function(e){return this.regexpEngine.compile(e)},e}(),G=new Q,U="\n@code #number\n@data{\n    @page 1\n    @pageSize 20\n    @dataList(20)[\n        @name #name\n        @age #number(1,20)\n        @address ['浙江', '北京', '上海']??\n        @email #email\n        @mobile #mobile\n        @avatar #img('100x100')\n        @books(2)[\n            @name ['三国演义', '水浒传']..\n            @price #decimal\n            @content #paragraph(2)\n            @onSale #bool\n        ]\n    ]\n}\n".trim(),X=!0,Y=null;function Z(e){clearTimeout(Y),Y=setTimeout((function(){var t=Date.now(),n=Q.compile(e).getJSON(),r=Date.now()-t;$("#cost").text("执行耗时："+r+"ms"),X?$("#jsonViwer").jsonViewer(n.error||n.data,{rootCollapsable:!0,collapsed:!1,withQuotes:!0,withLinks:!0}):console.warn(n)}),1e3)}$("#codeEditor").val(U),Z(U),$("#btn").on("click",(function(){(X=!X)?(this.innerHTML="关闭更新JSONTree",$("#jsonViwer").css("opacity",1)):(this.innerHTML="开启更新JSONTree",$("#jsonViwer").css("opacity",.1))})),$("#codeEditor").on("keydown",(function(e){var t=this;if("Tab"===e.key){e.preventDefault();var n="    ",r=t.selectionStart,i=t.selectionEnd,o=window.getSelection().toString();o=n+o.replace(/\n/g,"\n"+n),t.value=t.value.substring(0,r)+o+t.value.substring(i),t.setSelectionRange(r+4,r+o.length)}else setTimeout((function(){Z(t.value)}))}))}(mockv);
