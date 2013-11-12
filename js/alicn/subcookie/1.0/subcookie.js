/*!!cmd:compress=true*/
/*!!cmd:jsCompressOpt=["--disable-optimizations"]*/
/**
 * author terence.wangt
 * date 2013-10-11
 * dependence: jQuery
 * 取中文站cookie的专用函数
 */

define('lofty/alicn/subcookie/1.0/subcookie', ['jquery', 'lofty/util/cookie/1.0/cookie'], function ($, Cookie) {
    'use strict';

	var ALICNWEB = 'alicnweb';
	
	var subCookie = {
		
		get:function(key){
			
			var hash = unparam(Cookie.get(ALICNWEB) || '', '|') || {};
			
			return hash[key] === undefined ? null : hash[key];
		},
		
		set:function(key, value, options){
		
			var hash = unparam(Cookie.get(ALICNWEB) || '', '|') || {};
			
			options = options ||
			{
				path: '/',
				domain: '1688.com',
				expires: new Date('January 1, 2050')
			};
			
			if (arguments.length > 1) {
				hash[key] = value;
				return Cookie.set(ALICNWEB, $.param(hash).replace(/&/g, '|'), options);
			}
			return null;
		}
	};
	
	/**
	 * 将字符串转换成hash, 例如：?key1=value1&key2=value2 ==> {key1:value1, key2:value2}
	 * @param {Object} s
	 * @param {Object} separator
	 */
	function unparam(s, separator){
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
	};

    return subCookie;
});


