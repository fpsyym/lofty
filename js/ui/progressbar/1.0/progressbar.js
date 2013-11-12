/*!!cmd:compress=true*/
/*!!cmd:jsCompressOpt=["--disable-optimizations"]*/

/**
 * @module progressbar
 * @author yefei.niuyf
 * @date 20130825
 * 
 */

define('lofty/ui/progressbar/1.0/progressbar', ['lofty/lang/class', 'lofty/ui/widget/1.0/widget', 'lofty/util/template/1.0/tplhandler', 'jquery'], 

	function( Class, Widget, TplHandler, $){
	
	'use strict';
		
	var Progressbar = Class( Widget, {
		/**
		 * 默认配置
		 */
		options: {
			maxValue: 100,               // 最大值
			initValue: 0,				 // 初始值
			enableAnim: true,                   // 使用enable动画
			classPrefix: 'fui-progressbar',			//默认的class前缀
			duration: 2,
			height: 12,
			create: null,
			ready: null,
			change: null,
			complete: null
		},
		
		/**
		 * 组件内部事件集中在events变量中定义(也可通过bindEvent动态添加事件) 
		 * 其中的{options.classPrefix}会由widget基类自动替代为option中指定的className
		*/
		events: {
		},
		
		_create: function() {

			this.valDiv = $('div.fui-progressbar-value', this.get('el'));
			
			this.setUp();
			
			this.handleEvents(); 
			
			this.render();

			this.maxWidth = parseInt(this.get('width')) || this.get('el').width(); 
			
			this.get('create') && this.get('create').call(this);

			this.changeValue(this.get('initValue'), 'ready');
		},
		
		setUp: function() {

			//init
			this.valDiv.height(parseInt(this.get('height')));
			this.currentValue = 0;
			this.currentWidth = 0;
			this.valDiv.width(0);

			var width = parseInt(this.get('width'));
			if (width) {
				this.get('el').width(width);
			}

		},
		
	
		handleEvents: function(){
		
		},
		
		getValue: function() {
			return this.currentValue;
		},
		
		getPercentValue: function() {
			return (this.currentValue / this.get('maxValue')) * 100;
		},
		
		getMaxValue: function() {
			return this.get('maxValue');
		},
		
		setValue: function(value) {
			this.changeValue(value, 'change');
		},
		
		setPercentValue: function(value) {
			this.changeValue(value * this.get('maxValue'), 'change');
		},
		
		changeValue: function(targetValue, fn) {
			if (targetValue <= this.currentValue || targetValue > this.get('maxValue')) {
				return ;
			}

			var self = this,
				targetWidth = this.getWidth(targetValue);

			if (this.get('enableAnim')) {
				this.goProcess(targetWidth, function() {
					self.afterValueChanged(targetValue, fn);		
				});
			} else {
				this.valDiv.width(targetWidth);
				self.afterValueChanged(targetValue, fn);		
			}
		},

		afterValueChanged: function(targetValue, eventType) {
			this.currentValue = targetValue;
			this.currentWidth = this.getWidth(this.currentValue);

			eventType && this.trigger(eventType);

			if (targetValue === this.get('maxValue')) {
				this.trigger('complete');
			}
		},

		goProcess: function(targetWidth, fn) {
			var duration = (targetWidth - this.currentWidth) * this.get('duration');

			this.valDiv.animate({
				width: targetWidth + 'px'
			}, duration, fn);
		},

		getWidth: function(value) {
			return value / this.get('maxValue') * this.maxWidth;
		},
			
		/** 
		 * @methed 覆盖基类实现，用于处理template模板
		 */
		handleTpl:function(){
			var data = {};

			data.classPrefix = this.get('classPrefix');
			TplHandler.process.call(this, data);
		},
		
		/**
		 * 定义模板变量  注意：变量名必须是tpl
		 */
		tpl: [
		  '<div class="<%= classPrefix %>">',
				'<div class="fui-progressbar-value">',
				'</div>',
		'</div>'
		].join(''),
				
		end:0
	});
		
	return Progressbar;
});
