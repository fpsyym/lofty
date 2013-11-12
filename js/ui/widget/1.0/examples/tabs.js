/**
 * @module lofty/ui/tabs/tabs
 * @author 
 * @date 20130630
 * 
 */

/*!!cmd:compress=true*/
/*!!cmd:jsCompressOpt=["--disable-optimizations"]*/
 
define('lofty/ui/tabs/1.0/tabs', ['lofty/lang/class', 'lofty/ui/widget/1.0/widget', 'lofty/util/template/1.0/tplhandler', 'jquery'], 

	function( Class, Widget, TplHandler, $){
		
		var Tabs = Class( Widget, {
			/**
			 * ���Ե�Ĭ������
			 */
			options: {
				myOptions: true,                // �����ĳ������
				classPrefix:'fui-tabs'			// ÿ�� UI �������Ҫ֧��classPrefix���ԡ�ע����������нڵ�ѡ������Ҫ����classPrefix
			},
			
			/**
			 * ����ڲ��¼�������events�����ж���(Ҳ��ͨ��bindEvent��̬����¼�) 
			 * ���е�{options.XXX}����widget�����Զ����Ϊoption��ָ�������ԣ����û����ǵ����ԣ�
			*/
			events:{
				'{options.titleSelector} a': {
					'click':function(e){e.preventDefault();}
				},
				'{options.classPrefix}-ul a': {
					'click':'onTabsHeadClicked'
				},
			},
			
			/** 
			 * @methed UI �������ں������ڵ���_create��������ǰ������Widget.js������ɵ�����
			 * 1�����Գ�ʼ��
			 * 2�����������ʽ���ж�
			 * 3��������¼���
			 */
			_create: function() {
				
				
				//���ϣ�����ʵ������ʱ��Ͱ����ֱ����Ⱦ��Dom�ϣ����� _create()�����е���render����
				//���ϣ�����ʵ����ʱ���޸�dom����_create()�����в�Ҫ���ø÷����������ʹ���ߴ���ʵ�����Լ���������ʱ����
				this.render();
			},
			
			/** 
			 * @description  ����widget���Ѿ���render������Ĭ��ʵ�֣�����ɸ���ʵ����Ҫѡ���Ը���
			 * @methed render������ɽ������Dom�ڵ���Ⱦ��ҳ���ϵ����� (�޸�Dom�ڵ�)��
			 * @note ��Dom�ڵ�����޹ص��������������¼�����ģ����Ⱦ�ȣ��벻Ҫ������������С�
			 * 
			 */
			render:function(){
				
			},
			
			/** 
			 * @methed ���ǻ���ʵ�֣����ڴ���templateģ��
			 * @description 
			 */
			handleTpl:function(){
				
				var data = {};
				data.classPrefix = this.get('classPrefix');
				data.children  = this.get('children') || [];
				TplHandler.process.call(this,data);
			},
						
			/**
			 * ����ģ�����  ע�⣺������������tpl
			 * ע�⣺�����һ��Ҫͨ��  this.get('tpl')������ this.set('tpl', newVal)�ķ�ʽʹ��tpl��
			 * 	     ������ʹ��this.tpl�� ��Ϊwidget.js�л��tpl����һ���Ĵ���
			 */
			tpl: [
			  '<div class="<%= classPrefix %>">',
				'<div class="fui-t">',
					'<ul class="<%= classPrefix %>-ul">',
						'<% for ( var i = 0; i < children.length; i++ ) { %>',
							'<li class="<%= classPrefix %>-t"><a href="#"><%= children[i].label%></a></li>',
						'<% } %>',
					'</ul>',
				'</div>',
				'<div class="fui-d">',  
					'<% for ( var i = 0; i < children.length; i++ ) { %>',
						'<div class="<%= classPrefix %>-b"><%=children[i].content%></div>',
					'<% } %>',
				'</div>',
			'</div>'
			].join(''),
			
			
			/**
			 * @example �ص�ʾ������
			 * @description events �ж���Ļص�������widget���������¼����Զ�ע�ᡣ
			 */
			onTabsHeadClicked:function(){
				
			},
					
			end:0
		});
		
		////////////////////////////////////////////////////////////////////////////////////////////
		// ˽�з���������
		// ���涨�����һЩ�����˽�з��� ����ϣ����¶�ӿڸ��ⲿ��Ҳ�������ⲿͨ��AOP�ķ�ʽ��д��
		
		/**
		 * @useage  �������Ĺ��÷���������Щ˽�з�������˽�з���������this������ֱ�ӵ��ã�privateFunc();
		 * @useage  �������Ĺ��÷���������Щ˽�з�������˽�з�����Ҫʹ��this��������ã�privateFunc.call(this);
		 */
		function privateFunc() {
			return;
		}
	
			
		return Tabs;
});
