/*!!cmd:compress=true*/
/*!!cmd:jsCompressOpt=["--disable-optimizations"]*/

/**
 * @module fdui/ui/flash
 * @from 
 * @author chuanpeng.qchp
 * @date 20130731
 * */
  
define( 'lofty/ui/flash/1.0/flash', ['lofty/lang/class', 'lofty/lang/base','lofty/util/misc/1.0/misc','jquery'], 
	function( Class, Base,util,$){
		'use strict';
		var Flash = Class( Base,{
			options:{
				/**
				 * ������ڵ㣬Ĭ����document.body
				 * @type {String}
				 */				
				container: {
					value: 'body',
					getter: function(s) {
						if ('string' === typeof s) {
							s = $(s);
						}
						return s;
					}
				},
				flashvars: {
                    eventHandler: 'lofty.commonspace.flash.triggerHandler'
                }
			},
			/**
			 * @description ��ں�����ͨ������£��������������Ҫ��д�˺�����
			 */
			init: function( config) {
				this.options = $.extend(true, {}, Flash.prototype.options, this.options);
			
				//���û���Ĺ��캯������ʼ�����Լ�plugin��
				Base.prototype.init.call(this, config || {});
				
				//����id��������id
				if (!this.get('container')[0].id) {
					generateId.call(this);
				}
			
				//��������ľ���ʵ��
				if(this._beforeCreate() !== false){
					createSwfObject.call(this);
				};
			},
			_beforeCreate:function(){
			},
			/**
			 * ��options�а�����Ч�����ò�������������flash����˵����Ĳ���
			 * �÷�����Ҫʱ����Ҫ��extend�ĺ����н�����д
			 */
			_getFlashConfigs:function (){
				var configs = {};
				for(var op in this.options)
				{
					configs[op] = this.get(op);
				}
				configs = $.extend(true, {}, configs);
				//swfidĬ��Ϊ����ID
				configs.flashvars.swfid = this.get('container')[0].id;
				//ɾ�������������
				delete configs.disabled;
				delete configs.module;
				delete configs.container;
				delete configs.el;
				delete configs.tpl;
				delete configs.extendTplData;
				delete configs.renderType;
				
				return configs;
			},
			/**
			 * ��ȡflash����
			 * @return {HTMLDOMElement} flash����
			 */
			getFlash: function(){
				return this.obj;
			},

			/**
			 * ����flash�ڲ��ķ���
			 * ������������б��룬����ֵ���н��룬���Flash��������bug
			 * @return flash�ڲ�ִ�н��
			 */
			callMethod: function(){

				function fixSlashBugForFlashPlayer(value){
					return encodeURIComponent(value);
				}

				var args    = $.makeArray(arguments),
					fn      = args.shift(),
					swf     = this.obj;

				$.each(args, function(id, value){
					args[id] = fixSlashBugForFlashPlayer(value);
				});

				var result = swf[fn].apply( swf, args);
				return decodeURIComponent(result);
			}
		});
		
			
		var OBJECT = 'object', 
			FUNCTION = 'function', 
			isIE = $.browser.msie, useEncode, flashVersion, modules = {},
			Plugin = navigator.plugins['Shockwave Flash'] || window.ActiveXObject;
		try {
			flashVersion = Plugin.description ||
			(function(){
				return (new Plugin('ShockwaveFlash.ShockwaveFlash')).GetVariable('$version');
			}());
		} catch (e) {
			flashVersion = 'Unavailable';
		}
		var flashVersionMatchVersionNumbers = flashVersion.match(/\d+/g) || [0];
			
		//����window�µ��¼����ӣ���flash����
		namespace('lofty.commonspace.flash');
		
		
		lofty.commonspace.flash.objects = {};
		lofty.commonspace.flash.triggerHandler = function(o){
			var swfid = o.swfid;
			var self = lofty.commonspace.flash.objects[swfid];
			self.trigger(o.type,o);
		};
		
		Flash.util = {
			/*
			 *
			 */
			available: flashVersionMatchVersionNumbers[0] > 0,
			/*
			 * activeX�������
			 */
			activeX: Plugin && !Plugin.name,
			/*
			 * ���ָ�ʽ�İ汾��ʾ
			 */
			version: {
				original: flashVersion,
				array: flashVersionMatchVersionNumbers,
				string: flashVersionMatchVersionNumbers.join('.'),
				major: parseInt(flashVersionMatchVersionNumbers[0], 10) || 0,
				minor: parseInt(flashVersionMatchVersionNumbers[1], 10) || 0,
				release: parseInt(flashVersionMatchVersionNumbers[2], 10) || 0
			},
			/**
			 * �ж������Flash�汾�Ƿ���ϴ���İ汾Ҫ��
			 * @param {Object} version
			 */
			hasVersion: function(version){
				var versionArray = (/string|number/.test(typeof version)) ? version.toString().split('.') : (/object/.test(typeof version)) ? [version.major, version.minor] : version || [0, 0];
				
				return compareArrayIntegers(flashVersionMatchVersionNumbers, versionArray);
			},
			/*
			 * �Ƿ�Բ�������encodeURI����
			 */
			encodeParams: true,
			/*
			 * expressInstall��swf�ļ�·��
			 */
			expressInstall: 'expressInstall.swf',
			/*
			 * �Ƿ񼤻�expressInstall
			 */
			expressInstallIsActive: false
			
		}
		
		/**
         * ����������һ��id
         */
        function generateId(){
            this.isGenerateId = true;
            this.get('container')[0].id = 'ui-flash' + $.guid;
        }
		
		function createSwfObject(){
			var container = this.get('container');
			//����flash����
			var configs = this._getFlashConfigs();
			var swfId = configs.flashvars.swfid;
			lofty.commonspace.flash.objects[swfId] = this;
			this.obj = createFlash.call(Flash.util,container,configs);                
			if (!this.obj) {
				destroy.call(this);
			}
			
		}
		
		function destroy(){
			var swfId = this.get('flashvars').swfid;
			if(lofty.commonspace.flash.objects[swfId]){
				delete lofty.commonspace.flash.objects[swfId];
			}
			if (this.isGenerateId) {
                this.get('container').removeAttr('id');
                delete this.isGenerateId;
            }
			delete self.obj;
			this.get("container").html("");
			
			Base.prototype.destory.call(this);
		}
		
		/**
		 * ����һ��flash����
		 * @param {Object} options	���ò���
		 * @return {HTMLDOMElement} flash object����
		 */
		function createFlash(container, options){
			var self = this;
			
			if (!options.swf || self.expressInstallIsActive || (!self.available && !options.hasVersionFail)) {
				return false;
			}
			//����߼��ǵ���⵽Flash�汾������Ҫ��ʱ���滻ΪexpressInstall��flash
			if (!self.hasVersion(options.hasVersion || 1)) {
				self.expressInstallIsActive = true;
				
				if (typeof options.hasVersionFail === FUNCTION) {
					if (!options.hasVersionFail.apply(options)) {
						return false;
					}
				}
				options = {
					swf: options.expressInstall || self.expressInstall,
					height: 137,
					width: 214,
					flashvars: {
						MMredirectURL: location.href,
						MMplayerType: (self.activeX) ? 'ActiveX' : 'PlugIn',
						MMdoctitle: document.title.slice(0, 47) + ' - Flash Player Installation'
					}
				};
			}
			
			var attrs = {
				//����FLash���õ���Javascript��������object��id��������ie�±���
				id: 'ui-flash-object' + $.guid++,
				width: options.width || 320,
				height: options.height || 180,
				style: options.style || ''
			};
			
			if (isIE) {
				attrs.classid = "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000";
				options.movie = options.swf;
			}
			else {
				attrs.data = options.swf;
				attrs.type = 'application/x-shockwave-flash';
			}
			
			useEncode = typeof options.useEncode !== 'undefined' ? options.useEncode : self.encodeParams;
			
			options.wmode = options.wmode || 'opaque';
			
			delete options.hasVersion;
			delete options.hasVersionFail;
			delete options.height;
			delete options.swf;
			delete options.useEncode;
			delete options.width;
			
			var html = ['<object ', objectFromObject(attrs), '>', paramsFromObject(options), '</object>'].join('');
			if (isIE) {
				var flashContainer = document.createElement('div');
				container.html(flashContainer);
				flashContainer.outerHTML = html;
			}
			else {
				container.html(html);
			}
			return container.children().get(0);
		}
		/**
		 * compareArrayIntegers
		 * @param {Object} a
		 * @param {Object} b
		 */
		function compareArrayIntegers(a, b){
			var x = (a[0] || 0) - (b[0] || 0);
			
			return x > 0 || (!x && a.length > 0 && compareArrayIntegers(a.slice(1), b.slice(1)));
		}
		
		/**
		 * objectToArguments
		 * @param {Object} o
		 */
		function objectToArguments(o){
			if (typeof o !== OBJECT) {
				return o;
			}
			
			var arr = [], str = '';
			
			for (var i in o) {
				if (typeof o[i] === OBJECT) {
					str = objectToArguments(o[i]);
				}
				else {
					str = [i, (useEncode) ? encodeURI(o[i]) : o[i]].join('=');
				}
				arr.push(str);
			}
			
			return arr.join('&');
		}
		
		/**
		 * objectFromObject
		 * @param {Object} o
		 */
		function objectFromObject(o){
			var arr = [];
			
			for (var i in o) {
				if (o[i]) {
					arr.push([i, '="', o[i], '"'].join(''));
				}
			}
			
			return arr.join(' ');
		}
		
		/**
		 * paramsFromObject
		 * @param {Object} o
		 */
		function paramsFromObject(o){
			var arr = [];
			
			for (var i in o) {
				arr.push(['<param name="', i, '" value="', objectToArguments(o[i]), '" />'].join(''));
			}
			
			return arr.join('');
		}
		function namespace(){
			var a = arguments, o, i = 0, j, d, arg;
			for (; i < a.length; i++) {
				o = window;
				arg = a[i];
				if (arg.indexOf('.')) {
					d = arg.split('.');
					for (j = (d[0] == 'window') ? 1 : 0; j < d.length; j++) {
						o[d[j]] = o[d[j]] || {};
						o = o[d[j]];
					}
				} else {
					o[arg] = o[arg] || {};
				}
			}
		}
		
	return Flash;
} );
