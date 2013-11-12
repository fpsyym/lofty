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
		 * Ĭ������
		 */
		options: {
			maxValue: 100,               // ���ֵ
			initValue: 0,				 // ��ʼֵ
			enableAnim: true,                   // ʹ��enable����
			classPrefix: 'fui-progressbar',			//Ĭ�ϵ�classǰ׺
			duration: 2,
			height: 12,
			create: null,
			ready: null,
			change: null,
			complete: null
		},
		
		/**
		 * ����ڲ��¼�������events�����ж���(Ҳ��ͨ��bindEvent��̬����¼�) 
		 * ���е�{options.classPrefix}����widget�����Զ����Ϊoption��ָ����className
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
		 * @methed ���ǻ���ʵ�֣����ڴ���templateģ��
		 */
		handleTpl:function(){
			var data = {};

			data.classPrefix = this.get('classPrefix');
			TplHandler.process.call(this, data);
		},
		
		/**
		 * ����ģ�����  ע�⣺������������tpl
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
