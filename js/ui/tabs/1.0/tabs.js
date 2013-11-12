/*!!cmd:compress=true*/
/*!!cmd:jsCompressOpt=["--disable-optimizations"]*/

/**
 * @module lofty/ui/tabs
 * @author terence.wangt
 * @from modify from butterfly & fdev4
 * @date 20130630
 * 
 */

define('lofty/ui/tabs/1.0/tabs', ['lofty/lang/class', 'lofty/ui/widget/1.0/widget', 'lofty/util/template/1.0/tplhandler', 'jquery'], 

	function( Class, Widget, TplHandler, $){
	'use strict';
		
		var Tabs = Class( Widget, {
			/**
			 * Ĭ������
			 */
			options: {
				autoPlay: '',              		// �Ƿ��Զ������л� String ������ѡֵ���� | line | random
				interval: 3000,                // �Զ��л���ʱ���� (��λ������)
				event: 'mouseenter',    		// �л����¼���������
				currentCls: 'fui-tab-current',  // ��ǰtab�Ĵ�����ʽ 
				disableCls: 'disabled', 		// �������ʱ��class
				titleSelector: '.fui-tab-t',    // ����Ԫ�ؼ�
				boxSelector: '.fui-tab-b',      // ����Ԫ�ؼ� 
				selected: 0,                    // ���ó�ʼ��ʱ�ڼ�������Ϊ��ǰ״̬ 
				effect:'default',				// �л�Ч������ѡֵ�� default, updown, leftright, fade
				duration:500,					// �л�Ч����Ĭ��ʱ��
				prev: '.fui-tab-prev',			// ��һҳѡ����
				next: '.fui-tab-next',			// ��һҳѡ����
				items: [],						// ��̬��Ⱦʱ����Ҫ���øò�������̬��Ⱦʱ��Ҫ����Ϊ[{title:'tab1', content:'<p>tab1 content</p>'}, {}]�ĸ�ʽ
				classPrefix: 'fui'				// Ĭ�ϵ�classǰ׺
			},
			
			/**
			 * ����ڲ��¼�������events�����ж���(Ҳ��ͨ��bindEvent��̬����¼�) 
			 * ���е�{options.classPrefix}����widget�����Զ����Ϊoption��ָ����className
			*/
			events:{
				'{options.titleSelector}': {
					'{options.event}':'onTitleEvent'
				},
				'{options.prev}': {
					'{options.event}':'prev'
				},
				'{options.next}': {
					'{options.event}':'next'
				},
				'{options.titleSelector} a': {
					'click':function(e){e.preventDefault();}
				}
			},
			
			_create:function(){
				
				this.index = -1;
				var defaultIdx = this.get('selected') || 0;
				
				var element 	= this.get('el');
				this.titles 	= element.find(this.get('titleSelector'));
				this.boxes  	= element.find(this.get('boxSelector'));
				this.prevNode 	= element.find(this.get('prev'));
				this.nextNode	= element.find(this.get('next'));
				
				if (this.boxes.length === 0) {
					return;
				}
				
				initEffect.call(this);
				handleAutoPlay.call(this);
				
				this.switchTo(defaultIdx);
				
				this.render();
			},
			
			 /**
			 * @methed switchTo ����tab
			 * @param {num} index ��Ҫ��ʾ��title���
			 */
			switchTo:function(index, callback) {
				
				if (index === this.index) {
					return;
				}

				var self = this,
					data = {
						lastIndex: this.index, 
						index: index,
						element: this.get('el'),
						duration: this.get('duration'),
						titles: this.titles,
						boxes: this.boxes
					};
				this.trigger('beforeSwitch', data);

				var currentCls = this.get('currentCls');
				var disableCls = this.get('disableCls');
				this.titles.eq(this.index).removeClass(currentCls);
				this.titles.eq(index).addClass(currentCls);
				this.index = index;

				this.effect.show(data, function() {

					self.boxes.eq(data.lastIndex).removeClass(currentCls);
					self.boxes.eq(data.index).addClass(currentCls);
					self.prevNode.toggleClass(disableCls, data.index === 0);
					self.nextNode.toggleClass(disableCls, data.index === self.boxes.length - 1);
					callback && callback();
					self.trigger('switch', data);
				});       
			},
		
			/**
			 * �����¼��ص����� 
			*/
			onTitleEvent:function(e){
				e.preventDefault();
				var item = $(e.currentTarget);
				var index = this.titles.index(item);
				this.switchTo(index);
			},
			
			/**
			 * @methed prev ��ʾ��һ��tab��ͬʱҲ����һҳ�¼��Ļص�����
			*/
			prev:function(e){
				e && e.preventDefault && e.preventDefault();
				
				var index = this.index - 1;
				if(index >= 0){
					this.switchTo(index);
				}
				return this;
			},
			
			/**
			 * @methed prev ��ʾ��һ��tab��ͬʱҲ����һҳ�¼��Ļص�����
			*/
			next:function(e){
				e && e.preventDefault && e.preventDefault();
				
				var index = this.index + 1;
				if(index < this.boxes.length){
					this.switchTo(index);
				}
				return this;
			},	
									
			/**
			 * @param items | json object ���һ���±�ǩ��
			 */
			addTab: function(items, index) {
				return this;
			},
			
			/**
			 * @param index | Number ɾ��һ����ǩ��
			 */
			removeTab: function(index) {
				return this;
			},
			
			/**
			 * @methed length  ����tab��
			 */
			getLength: function() {
				return this.boxes.length;
			},
			
			/**
			 * @methed idx ���ص�ǰindex
			 */
			getCurrentIndex: function() {
				return this.index;
			},
			
			
			/** 
			 * @methed ���ǻ���ʵ�֣����ڴ���templateģ�壬��̬��Ⱦʱ�Żᱻ����
			 */
			handleTpl:function(){
				
				var data = {};
				data.classPrefix = this.get('classPrefix');
				data.items  = this.get('items') || [];
				TplHandler.process.call(this,data);
			},	
			
			/**
			 * ����ģ�����  ע�⣺������������tpl
			 */
			tpl: [
			  '<div class="<%= classPrefix %>-tab">',
				'<div class="<%= classPrefix %>-t">',
					'<ul class="<%= classPrefix %>-tab-ul">',
						'<% for ( var i = 0; i < items.length; i++ ) { %>',
							'<li class="<%= classPrefix %>-tab-t"><a href="#"><%= items[i].label%></a></li>',
						'<% } %>',
					'</ul>',
				'</div>',
				'<div class="<%= classPrefix %>-d">',  
					'<% for ( var i = 0; i < items.length; i++ ) { %>',
						'<div class="<%= classPrefix %>-tab-b"><%=items[i].content%></div>',
					'<% } %>',
				'</div>',
			'</div>'
			].join(''),
					
			end:0
		});
		
		
		/**
		 * ��ʼ���л���Ϊ
		 */
		function initEffect() {
		
			var effect = this.get('effect');
			if (typeof effect === 'string') {
				this.get('el').addClass('fui-tab-effect-' + effect);
				effect = Tabs.Effect[effect];
			}
			
			effect = typeof effect === 'function' ? { show: effect } : effect;		
			effect.setup && effect.setup(this);
			this.effect = effect;
		};
	
		/**
		 * �����Զ��л�
		 */
		function handleAutoPlay(){
		
			var autoPlay = this.get('autoPlay');
			if (!autoPlay || this.boxes.length <= 1) {
				return;
			}
			
			var interval = this.get('interval'),
				stop = false;

			this.get('el').on('mouseenter', function() {
				stop = true;	
			}).on('mouseleave', function() {
				stop = false;	
			});
			
			var self = this;
			var fn = function() {
				if (stop) {
					setTimeout(fn, interval);
					return;
				}
				
				var index = 0;
				// ����һ����������������������ķ�ΧΪ��[min, max]
				if(autoPlay === 'random'){
					while (self.index === 
						(index = Math.floor(Math.random() * self.boxes.length)));		
				}
				else{
					index = (self.index +1) % self.boxes.length;
				}
				self.switchTo(index, function() {
					setTimeout(fn, interval);
				});
			};

			setTimeout(fn, interval);
		};
		

		/**
		 * Ч������
		 */
		Tabs.Effect = {
			'default':  function(o, callback) {
				o.boxes.hide()
				o.boxes.eq(o.index).show();

				callback();
			},

			/**
			 * ���¹���
			 */
			'updown': function(o, callback) {
				var now = o.boxes.eq(o.index),
					content = now.parent(),
					contentTop = content.offset().top,
					nowTop = now.offset().top;

				content.css('position', 'relative');
				content.stop(true).animate({
					top: contentTop - nowTop
				}, o.duration, callback);	
			},

			/**
			 * ���ҹ���
			 */
			'leftright': {
				setup: function(o) {
					var boxes = o.boxes,
						cWidth = 0,
						content = boxes.eq(0).parent();

					boxes.each(function() {
						var pane = $(this),
							width = pane.width();	

						pane.width(width);
						cWidth += width;
					});
					
					content.addClass('fd-clr').width(cWidth + 100);
					boxes.css('float', 'left');
				},

				show: function(o, callback) {
					var now = o.boxes.eq(o.index),
						content = now.parent(),
						
						contentLeft = content.offset().left,
						nowLeft = now.offset().left;

					content.css('position', 'relative');
					content.stop(true).animate({
						left: contentLeft - nowLeft
					}, o.duration, callback);
				}
			},
			
			/**
			 * ����
			 */
			'fade': {
				setup: function(o) {
					var boxes = o.boxes,
						content = boxes.eq(0).parent();

					content.css('position', 'relative');
					boxes.css({
						position: 'absolute',
						left: 0,
						top: 0
					});
				},

				show: function(o, callback) {
					var last = o.lastIndex === -1 ? $() : o.boxes.eq(o.lastIndex),
						now = o.boxes.eq(o.index),
						d = $.Deferred();

					o.boxes.not(last).css('opacity', 0);
					
					// �µ��Ƶ�������, ��������ʾ����
					now.css({
						'z-index': 2	
					}).stop(true).animate({
						opacity: 1
					}, o.duration, function() {
						d.resolve();	
					});

					// �ϵ��Ƶ��ڶ���, ����������
					last.css('z-index', 1).stop(true).animate({
						opacity: 0
					}, o.duration, function() {
						last.css('z-index', '');
						d.resolve();	
					});

					d.done(callback);
				}
			}			
		};
			
		return Tabs;
});
