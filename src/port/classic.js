/*! Lofty v0.1 beta Classic http://lofty.fangdeng.org/ MIT*/
(function(c){if(!c.lofty){var e={},b=function(a,g,h){if(!e[a]){h||(h=g,g=[]);if("function"===typeof h){for(var c=[],m=0,k=g.length;m<k;m++)c.push(e[g[m]]);h=h.apply(b,c)}e[a]=h||1}},a=function(a){return e[a]};b.version="0.1";b.cache={parts:e};b("global",c);b("require",function(){return a});c.lofty=b}})(this);
lofty("lang",function(){var c={}.toString,e=Array.prototype,b={isFunction:function(a){return"[object Function]"===c.call(a)},isArray:Array.isArray||function(a){return"[object Array]"===c.call(a)},isString:function(a){return"string"===typeof a},forEach:e.forEach?function(a,f,b){a.forEach(f,b)}:function(a,f,b){for(var c=0,e=a.length;c<e;c++)f.call(b,a[c],c,a)},map:e.map?function(a,f,b){return a.map(f,b)}:function(a,f,c){var e=[];b.forEach(a,function(a,b,k){e.push(f.call(c,a,b,k))});return e},indexOf:e.indexOf?
function(a,b){return a.indexOf(b)}:function(a,b){for(var c=0,e=a.length;c<e;c++)if(a[c]===b)return c;return-1}};return b});lofty("event",function(){var c=this.cache.events={},e=[].slice;return{on:function(b,a){(c[b]||(c[b]=[])).push(a)},emit:function(b){var a=e.call(arguments,1),f=c[b],g,h=0;if(f)for(;g=f[h++];)g.apply(null,a)},off:function(b){c[b]&&delete c[b]}}});
lofty("config",["lang"],function(c){var e=this.cache,b=e.config={},a=e.configRules={},e={addRule:function(b,c){a[b]={rule:c,keys:[]};return this},addItem:function(b,c){a[c]&&a[c].keys.push(b);return this}};e.addRule("object",function(a,b,c){if(a){for(var e in c)a[e]=c[e];return!0}return!1}).addRule("array",function(a,b,c){a?a.push(c):this[b]=[c];return!0});this.config=function(e){for(var g in e){var h=e[g],j=b[g],m=g,k=h,l=!1,d=void 0,n=void 0;for(n in a)if(l)break;else d=a[n],l=-1<c.indexOf(d.keys,
m)&&d.rule.call(b,j,m,k);l||(b[g]=h)}};return e});lofty("alias",["config","event"],function(c,e){var b=this.cache.config;c.addItem("alias","object");return function(a){var c=b.alias,g;if(c&&(g=c[a.id]))a.id=g;e.emit("alias",a)}});
lofty("module",["global","lang","event","alias"],function(c,e,b,a){var f=[],g=0,h=this.cache.modules={},j={get:function(d){d={id:d};a(d);return h[d.id]},has:function(d){return j.get(d)||k[d]?!0:!1},hasDefine:function(d){return h[d]?!0:!1},isAnon:function(d){return""===d.id},save:function(d){h[d._id||d.id]=d},autocompile:function(d){j.isAnon(d)&&j.compile(d)},compile:function(d){try{if(e.isFunction(d.factory)){var a=[],c=d.deps;e.isArray(c)&&e.forEach(c,function(b){var c;b=(c=k[b])?c(d):j.require(b,
d);a.push(b)});var f=d.factory.apply(null,a);void 0!==f?d.exports=f:d.entity&&d.entity.exports&&(d.exports=d.entity.exports);d.entity&&delete d.entity}else void 0!==d.factory&&(d.exports=d.factory);b.emit("compiled",d)}catch(m){b.emit("compileFail",m,d)}},require:function(d){var a=j.get(d);a?(a.compiled||(a.compiled=!0,j.compile(a)),b.emit("required",a),d=a.exports):(b.emit("requireFail",{id:d}),d=null);return d}},m=function(d,a,b){this.id=d;this.deps=a||[];this.factory=b;this.exports={};""===d&&
(d="__!_lofty_anonymous_"+g,g++,this._id=d)},k={require:function(){function d(d){return j.require(d)}b.emit("makeRequire",d);return d},exports:function(d){return d.exports},module:function(d){d.entity={id:d.id,exports:d.exports};return d.entity}},l=c.define;this.noConflict=function(){c.define=l};this.define=function(d,a,c){var k;k=arguments.length;1===k?(c=d,d=""):2===k&&(c=a,a=f,e.isString(d)||(a=d,d=""));if(j.hasDefine(d))return b.emit("existed",{id:d}),null;k=new m(d,a,c);b.emit("define",k);j.save(k);
j.autocompile(k)};c.define=this.define;return j});
lofty("loader",["global"],function(c){var e=this.cache.config,b=c.document,a=/\.css(?:\?|$)/,f=/loaded|complete|undefined/,g=536>1*c.navigator.userAgent.replace(/.*AppleWebKit\/(\d+)\..*/,"$1"),h=b&&(b.head||b.getElementsByTagName("head")[0]||b.documentElement),j=b.getElementsByTagName("base")[0],m=function(a,b){a.onerror=function(){a.onload=a.onreadystatechange=a.onerror=null;a=void 0;b&&b()}};return function(k,l){var d;if(a.test(k)){var n=d=b.createElement("link");if(g||!("onload"in n)){var q=b.createElement("img");
q.onerror=function(){l();q.onerror=null;q=void 0};q.src=k}else n.onload=n.onreadystatechange=function(){f.test(n.readyState)&&(n.onload=n.onreadystatechange=n.onerror=null,n=void 0,l&&l())},m(n,l);d.rel="stylesheet";d.href=k}else{var p=d=b.createElement("script");p.onload=p.onreadystatechange=function(a){a=a||c.event;if("load"===a.type||f.test(p.readyState))p.onload=p.onreadystatechange=p.onerror=null,e.debug||h.removeChild(p),p=void 0,l&&l()};m(p,l);d.async=!0;d.src=k}e.charset&&(d.charset=e.charset);
j?h.insertBefore(d,j):h.appendChild(d)}});
lofty("id2url",["global","event","config","alias"],function(c,e,b,a){var f=this.cache.config,g=/\?|\.(?:css|js)$|\/$/,h=/^https?:\/\//,j=(new Date).getTime();c=c.document.getElementsByTagName("script");c=c[c.length-1];c=(c.hasAttribute?c.src:c.getAttribute("src",4)).match(/([\w]+)\:\/\/([\w|\.|\:]+)\//i);f.baseUrl=c[0];b.addItem("resolve","array").addItem("stamp","object");return function(b){a(b);var c=f.resolve,l;if(c)for(var d=0,n=c.length;d<n&&!(l=c[d](b.id),l!==b.id);d++);b.url=l?l:b.id;e.emit("resolve",
b);h.test(b.url)||(b.url=f.baseUrl+b.url);!g.test(b.url)&&(b.url+=".js");c=f.hasStamp?j:null;if(l=f.stamp)for(var q in l)if(RegExp(q).test(b.id)){c=l[q];break}c&&(b.url+="?lofty.stamp="+c);e.emit("id2url",b)}});
lofty("request",["global","event","loader","id2url"],function(c,e,b,a){var f=this.cache,g=f.config,h=f.assets={};g.loadTimeout=1E4;var j=function(a,b){if(!a.timeout){c.clearTimeout(a.timer);e.emit("requested",a);var f,d;b?(a.status=2,d=a.callQueue):(a.status=-1,d=a.errorQueue);for(;f=d.shift();)f()}};return function(c,f,l){var d;c={id:c};a(c);d=h[c.url]||(h[c.url]=c);2===d.status?f&&f():(d.callQueue?d.callQueue.push(f):d.callQueue=[f],d.errorQueue?d.errorQueue.push(l):d.errorQueue=[l],1!==d.status&&
(d.status=1,d.timer=setTimeout(function(){d.timeout=!0;e.emit("requestTimeout",d);j(d,!1)},g.loadTimeout),b(d.url,function(){j(d,!0)})))}});
lofty("deferred",function(){var c=function(){},e=function(b){var a=this,e=[],g=0,h=0;b=b||0;var j=function(){g+h===b&&m()},m=function(){a.then=!h?function(a){a&&a()}:function(a,b){b&&b()};m=c;k(!h?0:1);k=c;e=[]},k=function(a){for(var b,c=0;b=e[c++];)(b=b[a])&&b()};this.then=function(a,b){e.push([a,b])};this.resolve=function(){g++;j()};this.reject=function(){h++;j()};j()};return function(){for(var b=new e(arguments.length),a,c=0;a=arguments[c++];)a(b);return b}});
lofty("use",["lang","event","module","request","deferred"],function(c,e,b,a,f){var g={fetch:function(a,e){g.get(a,function(){f.apply(null,c.map(a,function(a){return function(c){var e=b.get(a);e?g.fetch(e.deps,function(){c.resolve()}):c.resolve()}})).then(e)})},get:function(e,j,g){f.apply(null,c.map(e,function(c){return function(e){b.has(c)?e.resolve():a(c,function(){e.resolve()},function(){e.reject()})}})).then(j,g)}};e.on("makeRequire",function(a){a.use=function(a,e){c.isArray(a)||(a=[a]);g.fetch(a,
function(){var f=c.map(a,function(a){return b.require(a)});e&&e.apply(null,f)})}});return g});lofty("amd",["module","use"],function(c,e){var b=this.cache.config;b.amd=!0;c.autocompile=function(a){c.isAnon(a)&&(b.amd?e.fetch(a.deps,function(){c.compile(a)}):c.compile(a))}});
lofty("appframe",["global","event","config"],function(c,e,b){var a=this;a.appframe=function(f){f=(c[f]={define:a.define,log:function(){a.log.apply(null,arguments)},config:a.config,on:e.on,off:e.off}).config;f.addRule=b.addRule;f.addItem=b.addItem}});
lofty("log",["global","console","request","require"],function(c,e,b,a){var f=this,g=f.log=function(){},h=c.console;return{create:function(c){f.log=c?h&&h.warn?function(a,b){h[b||"log"](a)}:function(c,f){e?e(c,f):b&&b("lofty/kernel/console",function(){e||(e=a("console"));e(c,f)})}:g},log:function(a){f.log(a,"log")},warn:function(a){f.log(a,"warn")}}});
lofty("debug",["config","log","event"],function(c,e,b){c.addRule("debug",function(a,b,c){e.create(c);this[b]=c;return!0}).addItem("debug","debug");b.on("existed",function(a){e.warn(a.id+": already exists.")});b.on("compiled",function(a){e.log((a._id?a._id:a.id)+": compiled.")});b.on("compileFail",function(a,b){e.warn((b._id?b._id:b.id)+": "+a.message)});b.on("required",function(a){!a.visits?a.visits=1:a.visits++;e.log(a.id+": required "+a.visits+".")});b.on("requireFail",function(a){e.warn(a.id+": does not exist.")});
b.on("requested",function(a){e.log(a.url+" requested")});b.on("requestTimeout",function(a){e.warn("request "+a.url+" timeout.")})});
lofty("alicn",["global","event"],function(c,e){var b=/\.css(?:\?|$)/,a=/([a-z])([A-Z])/g;e.on("resolve",function(b){b.url=b.url.replace(a,function(a,b,c){return b+"-"+c}).toLowerCase()});this.config({amd:!1,hasStamp:!0,resolve:function(a){var c=a.split("/"),e=c[0],j=b.test(a)?"css/":"js/";switch(e){case "lofty":case "gallery":a="fdevlib/"+j+a;break;case "sys":a="sys/"+j+c.slice(1).join("/")}return a},debug:0<c.location.href.indexOf("lofty.debug=true")})});
