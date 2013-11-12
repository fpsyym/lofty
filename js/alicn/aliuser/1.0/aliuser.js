/*!!cmd:compress=true*/
/*!!cmd:jsCompressOpt=["--disable-optimizations"]*/

/**
 * @module lofty/alicn/aliuser
 * @description 获取中文站用户登录信息的类
 * @author terence.wangt
 * @date 20130926
 * */

define('lofty/alicn/aliuser/1.0/aliuser',['lofty/util/cookie/1.0/cookie', 'jquery'], function(Cookie, $){
    
    'use strict';
    
    var AliUser = {
	
		isLogin: function(){
			return (this.getLoginId() ? true : false);
		},
		
		//当前登录的ID
		getLoginId: function(){
			var loginId = Cookie.get('__cn_logon_id__');
			return loginId && decodeURIComponent(loginId);
		},
		
		getLastLoginId: function(){
			var lastLoginId = Cookie.get('__last_loginid__');
			return lastLoginId && decodeURIComponent(lastLoginId);
		},
		
		// 取得上一次登录的memberId
		getLastMemberId: function() {
			var lastMemberId = Cookie.get('last_mid');
			return lastMemberId && decodeURIComponent(lastMemberId);
		},

		/**
		* 从阿里集团的各个网站同步登录信息
		* 打通帐号登录
		* @example AliUser.updateLoginInfo({ source: ['b2b', 'taobao'] })
		*/
		updateLoginInfo: function(config) {
			config = $.extend({ source: ['b2b', 'taobao']}, config);

			var dfd = new $.Deferred,
			  sources = config.source,
			  current = 0,
			  self = this;
			  
			tryFromSrc( sources[current] );

			function tryFromSrc( src ) {
			  var handler = self['updateLoginInfoFrom' + src.substr(0,1).toUpperCase() + src.substr(1)].call(self);

			  if($.type(handler) === 'function') {
				  $.when( handler(dfd) ).always(function(){
					  if( self.IsLogin() ) {
						  dfd.resolve();
					  } else {
						  tryNextSource();
					  }
				  });
			  } else {
				  tryNextSource();
			  }
			}

			function tryNextSource() {
			  if(++current < sources.length) {
				  tryFromSrc( sources[current] );
			  } else {
				  dfd.resolve();
			  }
			}
			return dfd;
		},

		/**
		* 这个方法目前没有做任何判断操作，将来
		* 可能会发起一个jsonp请求，这样在每个不
		* 同域名下面都可以获取在B2B登录的帐号。
		*/
		updateLoginInfoFromB2b: function() {
			var dfd = new $.Deferred;
			dfd.resolve();
			return dfd.promise();
		},

		/**
		* 从淘宝同步登录信息
		*/
		updateLoginInfoFromTaobao: function() {
			
			var self = this;
			var dfd  = new $.Deferred;
			
			self.getLoginInfoFromTaobao().always(function(data){

				var name = data['__cn_logon_id__'],
				    mid = data['__last_memberid__'];

				if(name){
					name = encodeURIComponent(name);

					var cfg = { raw: true };

					if(/\balibaba\.com$/.test(location.hostname)) {
					  cfg.domain = 'alibaba.com';
					  cfg.path = '/';
					}else if(/\b1688\.com$/.test(location.hostname)){
					  cfg.domain = '1688.com';
					  cfg.path = '/';
					}

					Cookie.set('__cn_logon_id__', name, cfg );
					Cookie.set('__last_loginid__', name, $.extend({expires:30}, cfg) );
					Cookie.set('__cn_logon__', true, cfg );
					mid && Cookie.set('last_mid', encodeURIComponent(mid), cfg );

					self.loginId = name;
					self.isLogin = true;

					dfd.resolve( data );
				} else {
					dfd.resolve( data );
				}

			});

			return dfd.promise();
		},

		getLoginInfoFromTaobao: function() {
			var url = getTestConfig('style.logintaobao.sync.url') || 'http://b2bsync.taobao.com/tbc';
			return $.ajax({
				url: url,
				dataType: 'jsonp'
			}).promise();
		},

		/**
		* 云归项目添加
		* 有些id是系统自动生成的
		*/
		isLoginIdAutoGen: function() {
		  return /^b2b-.+/.test(this.LoginId());
		}
    };
    
	function getTestConfig(key) {
		return lofty.test && lofty.test[key];
	}
    
    return AliUser;
});
