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
			 * 默认配置
			 */
			options: {
				autoPlay: '',              		// 是否自动进行切换 String 三个可选值：空 | line | random
				interval: 3000,                // 自动切换的时间间隔 (单位：毫秒)
				event: 'mouseenter',    		// 切换的事件触发类型
				currentCls: 'fui-tab-current',  // 当前tab的触点样式 
				disableCls: 'disabled', 		// 触点禁用时的class
				titleSelector: '.fui-tab-t',    // 触点元素集
				boxSelector: '.fui-tab-b',      // 内容元素集 
				selected: 0,                    // 设置初始化时第几个触点为当前状态 
				effect:'default',				// 切换效果，可选值有 default, updown, leftright, fade
				duration:500,					// 切换效果的默认时间
				prev: '.fui-tab-prev',			// 上一页选择器
				next: '.fui-tab-next',			// 下一页选择器
				items: [],						// 静态渲染时不需要设置该参数，动态渲染时需要设置为[{title:'tab1', content:'<p>tab1 content</p>'}, {}]的格式
				classPrefix: 'fui'				// 默认的class前缀
			},
			
			/**
			 * 组件内部事件集中在events变量中定义(也可通过bindEvent动态添加事件) 
			 * 其中的{options.classPrefix}会由widget基类自动替代为option中指定的className
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
			 * @methed switchTo 设置tab
			 * @param {num} index 需要显示的title序号
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
			 * 触点事件回调函数 
			*/
			onTitleEvent:function(e){
				e.preventDefault();
				var item = $(e.currentTarget);
				var index = this.titles.index(item);
				this.switchTo(index);
			},
			
			/**
			 * @methed prev 显示上一个tab，同时也是上一页事件的回调函数
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
			 * @methed prev 显示下一个tab，同时也是下一页事件的回调函数
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
			 * @param items | json object 添加一个新标签卡
			 */
			addTab: function(items, index) {
				return this;
			},
			
			/**
			 * @param index | Number 删除一个标签卡
			 */
			removeTab: function(index) {
				return this;
			},
			
			/**
			 * @methed length  返回tab数
			 */
			getLength: function() {
				return this.boxes.length;
			},
			
			/**
			 * @methed idx 返回当前index
			 */
			getCurrentIndex: function() {
				return this.index;
			},
			
			
			/** 
			 * @methed 覆盖基类实现，用于处理template模板，动态渲染时才会被调用
			 */
			handleTpl:function(){
				
				var data = {};
				data.classPrefix = this.get('classPrefix');
				data.items  = this.get('items') || [];
				TplHandler.process.call(this,data);
			},	
			
			/**
			 * 定义模板变量  注意：变量名必须是tpl
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
		 * 初始化切换行为
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
		 * 处理自动切换
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
				// 产生一个随机整数，这个随机整数的范围为：[min, max]
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
		 * 效果变量
		 */
		Tabs.Effect = {
			'default':  function(o, callback) {
				o.boxes.hide()
				o.boxes.eq(o.index).show();

				callback();
			},

			/**
			 * 上下滚动
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
			 * 左右滚动
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
			 * 渐变
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
					
					// 新的移到最上面, 再慢慢显示出来
					now.css({
						'z-index': 2	
					}).stop(true).animate({
						opacity: 1
					}, o.duration, function() {
						d.resolve();	
					});

					// 老的移到第二层, 再慢慢淡出
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
