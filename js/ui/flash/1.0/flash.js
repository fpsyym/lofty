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
				 * 组件父节点，默认是document.body
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
			 * @description 入口函数，通常情况下，派生的组件不需要重写此函数。
			 */
			init: function( config) {
				this.options = $.extend(true, {}, Flash.prototype.options, this.options);
			
				//调用基类的构造函数，初始化属性及plugin等
				Base.prototype.init.call(this, config || {});
				
				//给无id容器分配id
				if (!this.get('container')[0].id) {
					generateId.call(this);
				}
			
				//子类组件的具体实现
				if(this._beforeCreate() !== false){
					createSwfObject.call(this);
				};
			},
			_beforeCreate:function(){
			},
			/**
			 * 从options中剥离无效的配置参数，返回生成flash对象说必须的参数
			 * 该方法必要时，需要在extend的函数中进行重写
			 */
			_getFlashConfigs:function (){
				var configs = {};
				for(var op in this.options)
				{
					configs[op] = this.get(op);
				}
				configs = $.extend(true, {}, configs);
				//swfid默认为容器ID
				configs.flashvars.swfid = this.get('container')[0].id;
				//删除多余的配置项
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
			 * 获取flash对象
			 * @return {HTMLDOMElement} flash对象
			 */
			getFlash: function(){
				return this.obj;
			},

			/**
			 * 调用flash内部的方法
			 * 将传入参数进行编码，返回值进行解码，解决Flash播放器的bug
			 * @return flash内部执行结果
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
			
		//放在window下的事件钩子，由flash调用
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
			 * activeX插件对象
			 */
			activeX: Plugin && !Plugin.name,
			/*
			 * 各种格式的版本表示
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
			 * 判断浏览器Flash版本是否符合传入的版本要求
			 * @param {Object} version
			 */
			hasVersion: function(version){
				var versionArray = (/string|number/.test(typeof version)) ? version.toString().split('.') : (/object/.test(typeof version)) ? [version.major, version.minor] : version || [0, 0];
				
				return compareArrayIntegers(flashVersionMatchVersionNumbers, versionArray);
			},
			/*
			 * 是否对参数进行encodeURI操作
			 */
			encodeParams: true,
			/*
			 * expressInstall的swf文件路径
			 */
			expressInstall: 'expressInstall.swf',
			/*
			 * 是否激活expressInstall
			 */
			expressInstallIsActive: false
			
		}
		
		/**
         * 给容器分配一个id
         */
        function generateId(){
            this.isGenerateId = true;
            this.get('container')[0].id = 'ui-flash' + $.guid;
        }
		
		function createSwfObject(){
			var container = this.get('container');
			//创建flash对象
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
		 * 创建一个flash对象
		 * @param {Object} options	配置参数
		 * @return {HTMLDOMElement} flash object对象
		 */
		function createFlash(container, options){
			var self = this;
			
			if (!options.swf || self.expressInstallIsActive || (!self.available && !options.hasVersionFail)) {
				return false;
			}
			//这个逻辑是当检测到Flash版本不符合要求时，替换为expressInstall的flash
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
				//假如FLash内置调用Javascript，则必需给object赋id，否则在ie下报错
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
