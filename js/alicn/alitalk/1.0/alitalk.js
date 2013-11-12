/*!!cmd:compress=true*/
/*!!cmd:jsCompressOpt=["--disable-optimizations"]*/
/*
 * �������� 3.4
 * @author terence.wangt 2013.08.29
 */

define( 'lofty/alicn/alitalk/1.0/alitalk', ['jquery'],  function($){

	'use strict';
	
	var Alitalk = {
		
		defaults:{
		
			cls: {									// ��ͬ״̬������ͼ���class name
				base: 'alitalk',
				on: 'alitalk-on',
				off: 'alitalk-off',
				mb: 'alitalk-mb'
			},
			attr: 'alitalk',						// �����Ϣ���ڵı�ǩ��Ĭ�ϻ����ж�data-ǰ׺��
			siteID: 'cnalichn',						// �������ڵ�վ�㣬
			remote: true,							// �Ƿ������û�����״̬
			
			prop: function(){						// ���ݸ�����ͻ��˵Ķ�����Ϣ
				var data = $(this).data('alitalk');
				if(typeof(data) == "undefined" || typeof(data.offerid) == "undefined") 
					return '';
				return '&gid=' + data.offerid;
			},

			getAlitalk: function(id, options){		//δ��װ��δ��⵽��װ��������ô˷���
				var data = $(this).data('alitalk');
				var offerid = '';
				if(typeof(data) == "undefined") 
					offerid = "undefined";
				else
					offerid = data.offerid;

				window.open('http://webww.1688.com/message/my_chat.htm?towimmid=' + id + '&offerid=' + offerid, '_blank');	
			},
			
			onRemote: function(data){			  // ÿ��DOM�ڻ�ȡ���û�״̬��Ϣ֮�󣬵��ô˷�����������д�˷�������Ӧ��ͬ��Ӧ������
				var element = $(this);
				switch (data.online) {
					case 0:
					case 2:
					case 6:
					default: //������
						element.html('��������').attr('title', '�Ҳ������ϣ�����������Ϣ��');
						break;
					case 1: //����
						element.html('������ϵ').attr('title', '���������ϣ����Ϻ���Ǣ̸');
						break;
					case 4:
					case 5: //�ֻ�����
						element.html('���Ҷ���').attr('title', '���ֻ����ߣ����Ϻ���Ǣ̸');
						break;
				}
			}
		},
		
		 /**
		 * ��ʼ��alitalk�ľ�̬����
		 * @param {object} opts ���ò����� ����Ԫ�ش���trigger��$֧�ֵ����б�ʶ
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
					//�����ӿ��Ż���֧��JSONP
					var ids = [];
					elements.each(function(i, elem){
						elem = $(elem);
						var data = $.extend({}, options, eval('(' + (elem.attr(options.attr) || elem.attr('data-' + options.attr) || '{}') + ')'));
						elem.data('alitalk', data);
						ids.push(data.siteID + data.id);
					}).bind('click', onClickHandler);
					//�Ӱ��������ȡ����״̬
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
		 * ������¼����
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
		 * ����Ⱥ����ĳ�ʼ���ӿ�
		 * @param {jQuery} $֧�ֵ����б�ʶ
		 */
		tribeChat:function(elements){
			if (elements.length) {
				elements.bind('click', onTribeChatClickHandler);
			}
		},
		
		/**
		 * ���ص�ǰ������version
		 */
		getVersion:function(){
			return version;
		},
		
		/**
		 * �ж���������Ƿ�װ
		 */	
		installed:function(){
			return isInstalled;
		}
		
	};
	
	
	//////////˽�з�������////////////////
	/////////
	
	var version	= 0;
	var isInstalled = false;
	var plugInstance = null;
	
	/**
	 * �����������
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
	 * ����ص�����
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
					//��������״̬
					data.online = arr[i];
					element.addClass(data.cls.base);
					
					switch (data.online) {
						case 0:
						case 2:
						case 6:
						default: //������
							element.addClass(data.cls.off);
							break;
						case 1: //����
							element.addClass(data.cls.on);
							break;
						case 4:
						case 5: //�ֻ�����
							element.addClass(data.cls.mb);
							break;
					}
					
					if (data.onRemote) {
						data.onRemote.call(element[0], data);
					}
				}
			});
		}
		//����
		if (options.onSuccess) {
			options.onSuccess();
		}
	}
	
	
	/**
	 * ����¼�������
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
		//��̬ģʽ�� ����Ĭ��״̬Ϊ����
		if (!data.remote) {
			data.online = 1;
		}
		//��û�л�ȡ��״̬
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
			//�����û�id
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
     * ����Ⱥ�������¼�������
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
                alert("�𾴵��û�������Ҫ��װ������������ܲ���Ⱥ���죬���ȷ�Ϻ󽫽��밢����������ҳ�档");
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
     * �ж��Ƿ�Ϊmac
     */
	function isMac(){
		return (navigator.platform.indexOf("Mac") > -1);
	}
	
	/**
     * ת��Ϊ����
     * @param {Object} s
     */
    function numberify(s){
        var c = 0;
        return parseFloat(s.replace(/\./g, function(){
            return (c++ === 0) ? '.' : '';
        }));
    }
	
	/**
     * ������ؼ�ִ�У��ж�������Ƿ��Ѿ���װ���������
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