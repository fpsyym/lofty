/*!!cmd:compress=true*/
/*!!cmd:jsCompressOpt=["--disable-optimizations"]*/

/**
 * @module lofty/ui/widget ������࣬���е�UI����̳��ڴ���
 * @extends Base
 * @class Widget
 * @author terence.wangt
 * @date 20130630
 * */

define( 'lofty/ui/widget/1.0/widget', ['lofty/lang/class', 'lofty/lang/base','jquery'], 

	function( Class, Base, $){
	'use strict';
		var Widget = Class( Base, {
			/**
			 * Ĭ��������
			 */
			options: {
				/**
				 * ģ���ַ�����
				 * ������Ѿ���Ⱦ��htmlԪ�أ����ṩ��Ⱦhtml�����ڵ��ѡ����
				 * @type {String}
				 */	
				tpl:'<div></div>',
				
				/**
				 * @type {Json Object}
				 * �û��Զ������Ⱦģ����������
				 */
				extendTplData:null,

				/**
				 * ������ڵ㣬Ĭ����document.body
				 * @type {String}
				 */				
				container: {
					value: 'body',
					getter: function(s) {
						if (isString(s)) {
							s = $(s);
						}
						return s;
					}
				},
				/**
				 * ������ڵ�
				 * @type {Node}
				 */
				el: {
					getter: function(s) {
						if (isString(s)) {
							s = $(s);
						}
						return s;
					}
				}
			},
			
			/**
			 * ������¼�������events�����ж���(Ҳ��ͨ��bindEvent��̬����¼�)
			 * @format:
			 * events:{
			 *    '':{mouseover: function(e){}},									//�󶨵����������
			 *    '#myWidget':{mouseover: function(e){}},							//����ڲ��¼�
			 *    '.fui-title':{click:'onShowTitle', mouseover:'onHoverTitle'},		//����ڲ��¼�
			 *    'document':{click: docClickCall},									//�����Ҫ�����ⲿdocument���¼�
			 *    'window':{mousedown: function(e){}}								//�����Ҫ�����ⲿwindow���¼�
			 *  }
			 */
			events: null,
			
			/**
			 * @description ��ں�����ͨ������£��������������Ҫ��д�˺�����
			 */
			init: function( config) {

				//��ʼ��options				
				this.mixOptions(['tpl', 'events']);
						
				//���û���Ĺ��캯������ʼ�����Լ�plugin��
				Base.prototype.init.call(this, config || {});
		
				//�ж��������Ⱦ��ʽ������ȡ������ڵ�
				this.buildElement();
				
				//��ʼ������¼�
				this.bindEvent();
		
				//��������ľ���ʵ��	
				this._create();
			},

			/**
			 * ���������destroy��ʱ�����
			 * @protected
			 */
			destory: function() {
			
				this.unbindEvent();
				
				//���û������������
				Base.prototype.destory.call(this);
			},
		
			/**
			 * �����������ں�������Ҫ�����Լ�ʵ��
			 * @public
			 */
			_create: function(node){
				
			},
			
			/**
			 * ��������ɸ�����Ҫѡ����ʵ�ָ÷���
			 * @public
			 */
			render: function(parent) {
							
				if(parent){
					this.set('container', parent);
				}
				var element = this.get('el');
				var container = this.get('container');
				if (container && !isRendered(element[0])) {
					element.appendTo(container);
				}
				return this;
			},
		
			/**
			 * ע������¼�����
			 * @param  {Object} events �¼�����
			 * @public
			 * 
			 * @useage: ���ʹ���߿���ֱ��ʹ�øú���Ϊ������Dom�¼�����ʽΪ��
			 * 			widget.bindEvent( {'.fui-text':{mouseover:function(e){}}} )
			 */
			 
			bindEvent: function(events) {
				
				events = events || this.get('events');
				for (var selector in events) {
					var es = events[selector];
					for (var type in es) {
						
						var selector = parseSelector(selector, this);
						var event = parseSelector(type, this) + '.events-' + this.wId;
						(function(handler, self) {
							var callback = function(e) {
								if (isFunction(handler)) {
									handler.call(self, e);
								} else {
									self[handler](e);
								}
							}
							
							var element = self.get('el');
							if (selector === "") {
								element.on(event, callback);
							} 
							else if(selector === "document"){
								$(document).on(event, callback);
							}
							else if(selector === "window"){
								$(window).on(event, callback);
							}
							else {
								element.on(event, selector, callback);
							}

						})(es[type], this);
					}
				}
				return this;
			},
		
			
			/**
			 * �Ƴ������¼�
			 * @param  {String} events �¼����󣬸�ʽ{'.fui-text':{mouseover:'onCallback'}}
			 * @descrpition ��eventsΪ�գ����Ƴ������¼�
			 */
			 
			unbindEvent: function(events) {
				
				if (!events) {
					var event = '.events-' + this.wId;
					removeEvent(this, event);
					
				}else{
					for (var selector in events) {
						var es = events[selector];
						var selector = parseSelector(selector, this);
						for (var type in es) {
							var event = parseSelector(type, this) + '.events-' + this.wId;
							removeEvent(this, event, selector);
						}
					}
				}
				return this;
			},

			/**
			 * @description el����������dom���ڵ㡣֧�ֶ�̬��Ⱦ����̬��Ⱦ����ǩ�Զ���Ⱦ����ģʽ
			 * ��̬��Ⱦ�����config�����õ�tplΪҳ����ĳ���ڵ��id��className����tpl:'#domId'����������ڽڵ��е�dom�ṹ������
			 * ��̬��Ⱦ�����config�����õ�tplΪģ���ַ���(js�е�tpl���������Զ���ģ���ַ���)���������Ⱦʱ��ʹ��ģ���е����ݴ�����
			 * renderType��{String} static | dynamic | autoRender
			 */		
			buildElement: function() {
				
				var node, 
					renderType = 'dynamic',
					tpl = this.get('tpl');
					
				this.wId = Guid();

				if (isString(tpl)) {
					// �����Dom�ڵ������ҳ����
					if (tpl.charAt(0) === '.' || tpl.charAt(0) === '#' || tpl === 'body') {
						node = $(tpl);
					}
				}else{
					node = tpl;
				}
				
				if(node && node.length>0) {
					//�����script�ڵ㣬��ֱ��ȡhtml
					if(node[0].nodeName.toUpperCase() == 'SCRIPT') {
						tpl = node.html();
						this.set('tpl', tpl);
					} else {
						renderType = 'static';
					}
				}				
				this.set('renderType', renderType);	
				
				//��̬��Ⱦ����html�ڵ���Ⱦ
				if( renderType ===  "static"){
					this.set('el', node);
				}
				//��̬��Ⱦ����template��Ⱦ
				else{
				
					var el = $(this.get('el'));
					this.handleTpl();
					
					if ((!el || el.length === 0)) {
					
						var elId = this.wId;
						var tpl = $(this.get('tpl'));					
						if (tpl.length > 1) {
                            tpl = $('<div id="' + elId + '"></div>').append(tpl);
                        } else {
                            elId = tpl.attr('id') || this.wId;
                            tpl.attr('id', elId);
                        }
						this.set('el', tpl);
					}else{	
						//������ֻ�б�ǩ��Ⱦ�Ż��ߴ��߼�����������bug����
						var container = this.get('container');
						container.append($(this.get('tpl')));
					}
				}
				if (!this.get('el')) {
					throw new Error('element is empty!');
				}
			},
			
			/**
			 * �������Ե�this.options��
			 * @param  {Array} attrs Ҫ���뵽options�е���������
			 */	
			mixOptions:function(attrs){
				
				for(var key in attrs){
					var attr = attrs[key];
					if(this[attr] && this.options){
						this.options[attr] = this[attr];
					}
				}
			},
			/**
			 * @description
			 * ģ����������������Ĭ��ʵ�֣�����ʵ��ʱ�ɸ���
			 * �������tplStr������� this.set('tpl', tplstr);
			 */
			handleTpl: function(){				

			}
		});
		
		
		// private functions
		
		var toString = {}.toString,
			isFunction = function( it ){
				return toString.call( it ) === '[object Function]';
			},
			isString = function( str ){
				return 'string' === typeof str;
			};
		
		var widgetCount = 0;
		function Guid() {
			return 'fui_widget_' + widgetCount++;
		};
	  
		function removeEvent(widget, event, selector){

			if( selector === 'document'){
				$(document).off(event);
			}
			else if( selector === 'window'){
				$(window).off(event);
			}
			else{
				var element = widget.get('el');
				element.off(event, selector);
			}
		};

		function isRendered(element) {
		
			var doc = document.documentElement;
			if($.contains){
				return $.contains(doc, element);
			}else{
				return !!(doc.compareDocumentPosition(element) & 16);
			}
		};
		
		function parseSelector(selector, widget){
			
			return selector.replace(/{([^}]+)}/g, function(m, name) {
				var parts = name.split('.');
				var point = widget, part;

				while (part = parts.shift()) {
					if (point === widget.options) {
					  point = widget.get(part);
					} else {
					  point = point[part];
					}
				}  
				if (isString(point)) {
					return point;
				}
				return '';
			});
		};
		
		return Widget;
});
