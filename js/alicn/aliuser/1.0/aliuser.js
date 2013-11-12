/*!!cmd:compress=true*/
/*!!cmd:jsCompressOpt=["--disable-optimizations"]*/

/**
 * @module lofty/alicn/aliuser
 * @description ��ȡ����վ�û���¼��Ϣ����
 * @author terence.wangt
 * @date 20130926
 * */

define('lofty/alicn/aliuser/1.0/aliuser',['lofty/util/cookie/1.0/cookie', 'jquery'], function(Cookie, $){
    
    'use strict';
    
    var AliUser = {
	
		isLogin: function(){
			return (this.getLoginId() ? true : false);
		},
		
		//��ǰ��¼��ID
		getLoginId: function(){
			var loginId = Cookie.get('__cn_logon_id__');
			return loginId && decodeURIComponent(loginId);
		},
		
		getLastLoginId: function(){
			var lastLoginId = Cookie.get('__last_loginid__');
			return lastLoginId && decodeURIComponent(lastLoginId);
		},
		
		// ȡ����һ�ε�¼��memberId
		getLastMemberId: function() {
			var lastMemberId = Cookie.get('last_mid');
			return lastMemberId && decodeURIComponent(lastMemberId);
		},

		/**
		* �Ӱ��Ｏ�ŵĸ�����վͬ����¼��Ϣ
		* ��ͨ�ʺŵ�¼
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
		* �������Ŀǰû�����κ��жϲ���������
		* ���ܻᷢ��һ��jsonp����������ÿ����
		* ͬ�������涼���Ի�ȡ��B2B��¼���ʺš�
		*/
		updateLoginInfoFromB2b: function() {
			var dfd = new $.Deferred;
			dfd.resolve();
			return dfd.promise();
		},

		/**
		* ���Ա�ͬ����¼��Ϣ
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
		* �ƹ���Ŀ���
		* ��Щid��ϵͳ�Զ����ɵ�
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
