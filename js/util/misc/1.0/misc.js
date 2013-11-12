/*!!cmd:compress=true*/
/*!!cmd:jsCompressOpt=["--disable-optimizations"]*/

/**
 * author xianxia.jianxx
 * date 2013-08-16
 * �����࣬һЩ�����Ĺ����������ж����ڴ���
 * dependence: jQuery
 */
 
define('lofty/util/misc/1.0/misc',['jquery'],function ($){
	var util = {
			
		/**
		 * Same as YUI's
		 * @method substitute
		 * @static
		 * @param {string} str string template to replace.
		 * @param {string} data string to deal.
		 * @return {string} the substituted string.
		 */
		substitute: function(str, data){
			return str.replace(/\{(\w+)\}/g, function(r, m){
				return data[m] !== undefined ? data[m] : '{' + m + '}';
			});
		},
		
		/**
	     * escape HTML
	     * @param {Object} str
	     * @param {Bolean} attr	 �Ƿ�����Խ��ж��⴦��
	     * @return {string}
	     */
	    escapeHTML: function(str, attr){
	      if (attr) {
	        return str.replace(/[<"']/g, function(s){
	          switch (s) {
	            case '"':
	              return '&quot;';
	            case "'":
	              return '&#39;';
	            case '<':
	              return '&lt;';
	            case '&':
	              return '&amp;';
	            default:
	              return s;
	          }
	        });
	      } else {
	        var div = document.createElement('div');
	        div.appendChild(document.createTextNode(str));
	        return div.innerHTML;
	      }
	    },
	    /**
	     * unescape HTML
	     * @param {Object} str
	     * @return
	     */
	    unescapeHTML: function(str){
	      var div = document.createElement('div');
	      div.innerHTML = str.replace(/<\/?[^>]+>/gi, '');
	      return div.childNodes[0] ? div.childNodes[0].nodeValue : '';
	    },
		
	    /**
		 * ���ַ���ת����hash, ���磺?key1=value1&key2=value2 ==> {key1:value1, key2:value2}
		 * @param {Object} s
		 * @param {Object} separator
		 */
		unparam: function(s, separator){
		  if (typeof s !== 'string') {
			return;
		  }
		  var match = s.trim().match(/([^?#]*)(#.*)?$/), hash = {};
		  if (!match) {
			return {};
		  }
		  $.each(match[1].split(separator || '&'), function(i, pair){
			if ((pair = pair.split('='))[0]) {
			  var key = decodeURIComponent(pair.shift()), value = pair.length > 1 ? pair.join('=') : pair[0];
			  
			  if (value != undefined) {
				value = decodeURIComponent(value);
			  }
			  
			  if (key in hash) {
				if (!$.isArray(hash[key])) {
				  hash[key] = [hash[key]];
				}
				hash[key].push(value);
			  } else {
				hash[key] = value;
			  }
			}
		  });
		  return hash;
		},
		
		/**
		* �¿����ڻ��ߵ�ǰ���ڴ�(Ĭ���¿�����),���IE��referrer��ʧ������
		* @param {String} url
		* @argument {String} �¿�����or��ǰ���� _self|_blank
		*/
		goTo: function(url, target){
			var SELF = '_self';
			target = target || SELF;
			if (!this.isIE()) {
				return window.open(url, target);
			}
			var link = document.createElement('a'), body = document.body;
			link.setAttribute('href', url);
			link.setAttribute('target', target);
			link.style.display = 'none';
			body.appendChild(link);
			link.click();
			if (target !== SELF) {
				setTimeout(function(){
					try {
						body.removeChild(link);
					} catch (e) {
					}
				}, 200);
			}
			return;
		},
		
		/**
		* TODO: ��Ϊ������ $.browser�İ汾
		*/
		isIE: function(){
			return !!($.browser.msie);
		},
		
		/**
		* TODO: ��Ϊ������ $.browser�İ汾
		*/
		isIE6: function(){
			return !!($.browser.msie && $.browser.version == 6);
		},
		
		/**
		 * @method substitute
		 * @desc ��������Լ��
		 */
        support : {
            JSON: 'JSON' in window,
            localStorage: 'localStorage' in window,
            WebSocket: 'WebSocket' in window
        },
		
		/**
		 * @method trim
		 * @desc ȥ���ַ���ǰ��հ�
		 */
		trim: function(str){
			return $.trim(str);
		},
		
		/**
		 * @method lenB
		 * @desc �����ַ����ĳ��ȣ��÷��������ļ�ȫ���ַ�������Ӣ���ַ�����
		 */
		lenB: function(str){
			if(str && typeof(str) === 'string'){
				return str.replace(/[^\x00-\xff]/g, '**').length;
			}else{
				return 0;
			}
		},
		
		/**
		 * @method cut
		 * @desc ����".lenB()"�Ĺ�����㳤�Ȳ���ȡ�ַ��������ݲ���������Ҫ׷�ӵ��ַ���
		 * @param str : �������ַ���
		 * @param len : Number ��Ҫ��ȡ�ĳ���
		 * @param ext : String �Խ�ȡ����ַ���׷�ӵ��ַ�����Ĭ�ϲ�׷��
		 * @return String ���ؽ�ȡ������ַ���
		 */
		cut: function(str, len, ext){
		
			if(!str || typeof(str) !== 'string') 
				return str;
			
			var cl = 0;
			if (this.lenB(str) <= len) {
				return str;
			}
			for (var i = 0, j = str.length; i < j; i++) {
				var code = str.charCodeAt(i);
				if (code < 0 || code > 255) {
				cl += 2
				} else {
					cl++
				}
				if (cl > len) {
				return str.substr(0, i == 0 ? i = 1 : i) + (ext || '');
				}
			}
			return '';
		}
		
    };
    return util;
});


