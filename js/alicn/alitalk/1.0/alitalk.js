/*!!cmd:compress=true*/
/*!!cmd:jsCompressOpt=["--disable-optimizations"]*/
/*
 * 阿里旺旺 3.4
 * @author terence.wangt 2013.08.29
 */

define( 'lofty/alicn/alitalk/1.0/alitalk', ['jquery'],  function($){

	'use strict';
	
	var Alitalk = {
		
		defaults:{
		
			cls: {									// 不同状态下旺旺图标的class name
				base: 'alitalk',
				on: 'alitalk-on',
				off: 'alitalk-off',
				mb: 'alitalk-mb'
			},
			attr: 'alitalk',						// 组件信息所在的标签（默认会先判断data-前缀）
			siteID: 'cnalichn',						// 旺旺所在的站点，
			remote: true,							// 是否请求用户在线状态
			
			prop: function(){						// 传递给桌面客户端的额外信息
				var data = $(this).data('alitalk');
				if(typeof(data) == "undefined" || typeof(data.offerid) == "undefined") 
					return '';
				return '&gid=' + data.offerid;
			},

			getAlitalk: function(id, options){		//未安装或未检测到安装旺旺后调用此方法
				var data = $(this).data('alitalk');
				var offerid = '';
				if(typeof(data) == "undefined") 
					offerid = "undefined";
				else
					offerid = data.offerid;

				window.open('http://webww.1688.com/message/my_chat.htm?towimmid=' + id + '&offerid=' + offerid, '_blank');	
			},
			
			onRemote: function(data){			  // 每个DOM在获取到用户状态信息之后，调用此方法。可以重写此方法来适应不同的应用需求
				var element = $(this);
				switch (data.online) {
					case 0:
					case 2:
					case 6:
					default: //不在线
						element.html('给我留言').attr('title', '我不在网上，给我留个消息吧');
						break;
					case 1: //在线
						element.html('和我联系').attr('title', '我正在网上，马上和我洽谈');
						break;
					case 4:
					case 5: //手机在线
						element.html('给我短信').attr('title', '我手机在线，马上和我洽谈');
						break;
				}
			}
		},
		
		 /**
		 * 初始化alitalk的静态方法
		 * @param {object} opts 配置参数， 触发元素传入trigger：$支持的所有标识
		 */
		init:function(options){
			
			options = options || {};
			var elements = options.trigger;
			if(!elements){
				options.online = options.online || 1;
				options = $.extend({}, this.defaults, options);
				onClickHandler.call(options);
			}
			else {
				options = $.extend({}, this.defaults, options);
				elements = $(elements).filter(function(){
					return !$.data(this, options.attr);
				});
				if (elements.length) {
					//旺旺接口优化后支持JSONP
					var ids = [];
					elements.each(function(i, elem){
						elem = $(elem);
						var data = $.extend({}, options, eval('(' + (elem.attr(options.attr) || elem.attr('data-' + options.attr) || '{}') + ')'));
						elem.data('alitalk', data);
						ids.push(data.siteID + data.id);
					}).bind('click', onClickHandler);
					//从阿里软件获取在线状态
					if (ids.length && options.remote) {
						$.ajax('http://amos.im.alisoft.com/mullidstatus.aw', {
							dataType: 'jsonp',
							data: 'uids=' + ids.join(';'), 
							success: function(o){
								success(o, elements, options);
							}
						});
					}
				}
			}
		},	
		
		/**
		 * 弹出登录窗口
		 * @param {String} id
		 */
		login:function(id){
			var src;
			var loginid = encodeURIComponent(id);
			if (version === 5) {
				src = 'alitalk:';
			}
			else {
				src = 'aliim:login?uid=' + (loginid || '');
			}
			invokeWW(src);
		},
		
		/**
		 * 参与群聊天的初始化接口
		 * @param {jQuery} $支持的所有标识
		 */
		tribeChat:function(elements){
			if (elements.length) {
				elements.bind('click', onTribeChatClickHandler);
			}
		},
		
		/**
		 * 返回当前旺旺的version
		 */
		getVersion:function(){
			return version;
		},
		
		/**
		 * 判断旺旺插件是否安装
		 */	
		installed:function(){
			return isInstalled;
		}
		
	};
	
	
	//////////私有方法变量////////////////
	/////////
	
	var version	= 0;
	var isInstalled = false;
	var plugInstance = null;
	
	/**
	 * 调用旺旺插件
	 */
	function invokeWW(cmd){
		var flag = 1;
		if($.browser.msie){
			try{
				(new ActiveXObject("aliimx.wangwangx")).ExecCmd(cmd);
				flag = 0;
			}catch(e){
			}
		}
		else{
			try{
				var mimetype = navigator.mimeTypes["application/ww-plugin"];
				if(mimetype){
					var plugin = plugInstance;
					plugin.appendTo(document.body);
					plugin[0].SendCommand(cmd, 1);
					flag = 0;
				}
			}catch(e){
			}
		}
		if(flag == 1){
			var ifr = $('<iframe>').css('display', 'none').attr('src', cmd).appendTo('body');
			setTimeout(function(){
				ifr.remove();
			}, 200);
		}
	}
		
		
	/**
	 * 请求回调函数
	 * @param {Object} response JSON object
	 * @param {Object} elements
	 * @param {Object} options
	 */
	function success(obj, elements, options){
		if (obj.success) {
			var arr = obj.data;
			elements.each(function(i){
				var element = $(this), data = element.data('alitalk');
				if (data) {
					//保存在线状态
					data.online = arr[i];
					element.addClass(data.cls.base);
					
					switch (data.online) {
						case 0:
						case 2:
						case 6:
						default: //不在线
							element.addClass(data.cls.off);
							break;
						case 1: //在线
							element.addClass(data.cls.on);
							break;
						case 4:
						case 5: //手机在线
							element.addClass(data.cls.mb);
							break;
					}
					
					if (data.onRemote) {
						data.onRemote.call(element[0], data);
					}
				}
			});
		}
		//重置
		if (options.onSuccess) {
			options.onSuccess();
		}
	}
	
	
	/**
	 * 点击事件处理函数
	 * @param {Object} event
	 */
	function onClickHandler(event){
		var element = $(this), data, feedback, prop, info_id;
		if (event) {
			event.preventDefault();
			data = element.data('alitalk');
		}
		else {
			data = this;
		}
		//静态模式下 设置默认状态为在线
		if (!data.remote) {
			data.online = 1;
		}
		//还没有获取到状态
		if (data.online === null) {
			return;
		}
		
		prop = data.prop;
		if (typeof prop === 'function') {
			prop = prop.call(this);
			var match = prop.match(/info_id=([^#]+)/);
			if (match && match.length === 2) {
				info_id = match[1];
			}
		}
		if(isMac()){
			feedback = '';
		}else{
			feedback = '&url2=http://dmtracking.1688.com/others/feedbackfromalitalk.html?online=' + data.online +
			'#info_id=' +
			(data.info_id || info_id || '') +
			'#type=' +
			(data.type || '') +
			'#module_ver=3#refer=' +
			encodeURI(document.URL).replace(/&/g, '$');
			//解析用户id
		}
		var loginid = encodeURIComponent(data.id);
		switch (version) {
			case 0:
			default:
				//data.getAlitalk.call(this, data.id);
				data.getAlitalk.call(this, data.id, data);
				break;
			case 5:
				invokeWW('Alitalk:Send' + (data.online === 4 ? 'Sms' : 'IM') + '?' + data.id + '&siteid=' + data.siteID + '&status=' + data.online + feedback + prop);
				break;
			case 6:
				if (data.online === 4) {
					invokeWW('aliim:smssendmsg?touid=' + data.siteID + loginid + feedback + prop);
				}
				else {
					invokeWW('aliim:sendmsg?touid=' + data.siteID + loginid + '&siteid=' + data.siteID + '&fenliu=1&status=' + data.online + feedback + prop);
				}
				break;
				
		}
		if (data.onClickEnd) {
			data.onClickEnd.call(this, event);
		}
	}
	
	/**
     * 参与群聊天点击事件处理函数
     * @param {Object} event
     */
    function onTribeChatClickHandler(event){
        var element = $(this), data;
        if (event) {
            event.preventDefault();
            data = element.data('alitalk');
			data = eval('(' + data + ')')
        }
        else {
            data = this;
        }
		var uid = '';
		if(data.uid)
			uid = encodeURIComponent(data.uid);
		if(uid != '' && uid.indexOf('cnalichn') < 0 && uid.indexOf('cntaobao') < 0 && uid.indexOf('enaliint') < 0)
			uid = 'cnalichn' + uid;
        switch (version) {
            case 0:
            default:
                alert("尊敬的用户，您需要安装阿里旺旺后才能参与群聊天，点击确认后将进入阿里旺旺下载页面。");
				window.location.href="http://wangwang.1688.com";
                break;
            case 5:
            case 6:
                invokeWW('aliim:tribejoin?tribeid=' + (data.tribeid || '') + "&uid=" + uid);
                break;
                
        }
        if (data.onClickEnd) {
            data.onClickEnd.call(this, event);
        }
    }
	
	/**
     * 判断是否为mac
     */
	function isMac(){
		return (navigator.platform.indexOf("Mac") > -1);
	}
	
	/**
     * 转化为数字
     * @param {Object} s
     */
    function numberify(s){
        var c = 0;
        return parseFloat(s.replace(/\./g, function(){
            return (c++ === 0) ? '.' : '';
        }));
    }
	
	/**
     * 组件加载即执行，判断浏览器是否已经安装了旺旺插件
     */
	isInstalled = (function(){
		
		 if ($.browser.msie) {
            var vers = {
                'aliimx.wangwangx': 6,
                'Ali_Check.InfoCheck': 5
            };
            for (var p in vers) {
                try {
                    new ActiveXObject(p);
                    version = vers[p];
					
                    return true;
                } 
                catch (e) {
                }
            }
        }
		
        if (isMac() || $.browser.mozilla || $.browser.safari) {
            var res = false;
            $(function(){
                if (navigator.mimeTypes['application/ww-plugin']) {
                    var plugin = $('<embed>', {
                        type: 'application/ww-plugin',
                        css: {
							visibility: 'hidden',
							overflow:"hidden",
							display:'block',
							position:'absolute',
							top:0,
							left:0,
							width: 1,
							height: 1
                        }
                    });
                    plugin.appendTo(document.body);
                    if (isMac()||(plugin[0].NPWWVersion && numberify(plugin[0].NPWWVersion()) >= 1.003) || (plugin[0].isInstalled && plugin[0].isInstalled(1))) {
                        version = 6;
                        res = true;
                    }
                    plugInstance = plugin;
                }
            });
            return res;
        }
        return false;
	})();

	
	return Alitalk;
	
});