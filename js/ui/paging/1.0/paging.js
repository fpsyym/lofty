/*!!cmd:compress=true*/
/*!!cmd:jsCompressOpt=["--disable-optimizations"]*/

/**
 * @module lofty/ui/paging
 * @author terence.wangt
 * @date 20130630
 * 
 */
 
define( 'lofty/ui/paging/1.0/paging', ['lofty/lang/class', 'lofty/ui/widget/1.0/widget', 'lofty/util/template/1.0/tplhandler', 'jquery'], 
	
  function( Class, Widget, TplHandler, $){
  'use strict';
    	
    var Paging = Class( Widget, {
		
		options:{
			currentPage : 1,        			//��ǰҳ��
            totalPage : 10,          			//ҳ������
			listSize: 9,						//ҳ�����ʡ�Ժ�ʱ���м���ʾ��ҳ�����
            hasForm : true,       				//�Ƿ����������Լ���ť
			showPrevNext:true,					//�Ƿ���ʾ����һҳ����ť
            onRender : null,					//���ҳ��ʱ�Ļص�����
			linkUrl : null,						//��̬��Ⱦ��ҳʱ����������onRender����������ҳ���linkUrl����ʽ��http://xxx?page={page} ��Ի����·��
			classPrefix: 'fui'					//Ĭ�ϵ�classǰ׺
		},
		
		/**
		 * ����ڲ��¼�������events�����ж���(Ҳ��ͨ��bindEvent��̬����¼�) 
		 * ���е�{options.classPrefix}����widget�����Զ����Ϊoption��ָ����className
		*/
		events:{
			'.{options.classPrefix}-paging-btn': {'click':'onPageBtnClk'},
			'.{options.classPrefix}-paging-list a': {'click':'onPageLinkClk'},
			'.{options.classPrefix}-paging-input': {
				'input':'onInputChanged', 
				'propertychange':'onInputChanged', 
				'blur':'onInputChanged'
			}
		},
		
		/**
		 * widget�������ں�������Ҫ��������߼�ʵ��
		*/
		_create: function(){
			
			this.totalPage = this.get('totalPage');
			this.currentPage = this.get('currentPage');
			
			this.render();
		},
		
		/**
		 * �����Ⱦ������֧��js�������dom���������ǻ���ʵ��
		*/
		render: function(page, totalPage) {
			
			/**
			 * renderType��������widget���ࣺ
			 * ��tpl����ֵΪhtmlģ���ַ��������ʾ�����ͨ��JS��̬��������ʱrenderTypeΪdynamic
			 * ��tpl����ֵΪDomѡ��������'#domId'�����ʾ�����ͨ��ҳ�������е�Dom�ڵ㴴������ʱrenderTypeֵΪstatic
			*/			
			if (this.get('renderType') == "static") {
				return;
			}

			var prefix = this.get('classPrefix');
			totalPage = totalPage !== undefined ? totalPage : this.totalPage;

			if (!this._rendered) {
				
				if (!this.get('hasForm')) {
					$('.'+ prefix +'-paging-form', this.get('el')).remove();
				} else if (totalPage === -1) {
					$('.'+ prefix +'-paging-total', this.get('el')).remove();
				}
				
				var container = this.get('container');
				this.get('el').appendTo(container);
								
				this._rendered = true;
			}
			
			$('.'+ prefix +'-paging-num', this.get('el')).html(totalPage);
			
			this.renderList(page, totalPage);
		},
		
		/**
		 * �������е�ҳ��
		 */
		renderList: function(page, totalPage) {
		
			var prefix = this.get('classPrefix');
			this.currentPage = page || this.currentPage;
			
			var html = [],
				currentPage = this.currentPage,
				showPrev = this.get('showPrevNext'),
			
				size = parseInt(this.get('listSize'), 10) || 7,
				from = currentPage - Math.floor((size - 4) / 2),
				to,
				now;

			if (totalPage === -1) {
				totalPage = Number.MAX_VALUE;
			}
			if (showPrev === undefined) {
				showPrev = true;
			}

			// ������ȥͷβ4��ҳ����м�ҳ��
			if (from + size - 2 > totalPage) {
				from = totalPage - size + 3;
			} 

			from < 3 && (from = 3);	// ���ٴӵ�3ҳ��ʼ
			to = from;
			for (var i = 0; i < size - 4; i++) {
				if (to > totalPage - 2) {
					break;
				}
				html.push(this.createItem(to, to, '', true));
				to++;
			}
			to--;

			// ����ҳ��2
			if (totalPage > 1) {
				now = Math.floor((from + 1) / 2);
				var item = from > now + 1 ? this.createItem('...', now,  prefix + '-omit') : this.createItem(now, now, '', true);
				html.unshift(item); 
			}

			// ����ҳ��1
			if (totalPage !== 0) {
				html.unshift( this.createItem(1, 1, '', true));
			}

			// ��һҳ
			if (showPrev) {
				var cls = currentPage === 1 ? ( prefix +'-prev '+ prefix +'-prev-disabled' ) : ( prefix + '-prev');
				html.unshift( this.createItem('��һҳ', currentPage - 1, cls));
			}

			// ��������2��ҳ��
			if (totalPage > 2) {
				now = this.totalPage === -1 ? to + 10 : Math.floor((totalPage + to + 1) / 2);
				var item = to < now - 1 ? this.createItem('...', now, prefix + '-omit') : this.createItem(now, now, '', true);
				html.push(item);
			}

			// �������1��ҳ��
			if (this.totalPage !== -1 && totalPage > 3) {
				html.push( this.createItem(totalPage, totalPage, '', true) );
			}

			// ������һҳ
			if (showPrev) {
				var cls = currentPage === totalPage ? ( prefix +'-prev '+ prefix +'-next-disabled' ) : ( prefix + '-prev');
				html.push( this.createItem('��һҳ', currentPage + 1, cls));
			}
			
			$('.' + this.get('classPrefix') + '-paging-list', this.get('el')).html(html.join(''));
		},
		
		/**
		 * ��������ҳ��
		 */
		createItem: function(text, page, className, current) {
			
			var prefix = this.get('classPrefix');
			var tpl = '<a href="#" data-page="{page}" class="{className}">{text}</a>';
			
			if(className === ( prefix+ '-omit')){
				 tpl = '<span class="' + prefix + '-omit">��</span>';
				 return tpl;
			}
			
			if (current && page === this.currentPage) {
				className += (' '+ prefix + '-current');
			}

			return substitute(tpl, {
				page: page,
				className: className,
				text: text
			});
		},
		
		/**
		 * ���ҳ�����ӵĻص�����
		 */
		onPageLinkClk: function(e){
			
			if (this.get('renderType') == "static") {
				return;
			}
			e.preventDefault();
			
			var elm = $(e.currentTarget);
			
			// ��Чҳ
			var prefix = this.get('classPrefix');
			
			if (elm.hasClass( prefix+ '-current') || 
					elm.hasClass( prefix + '-prev-disabled') || elm.hasClass( prefix + '-next-disabled')) {
				e.preventDefault();
				return;
			}

			// û�ṩonRender����������ת
			var onRender = this.get('onRender');
			var page = elm.data('page');
			if (!onRender) {
				return this._onRender(page);
			}

			if (onRender(page) !== false) {
				this.render(page, this.totalPage);
			}
		},

		/**
		 * �����ҳȷ����ť�Ļص�����
		 */
		onPageBtnClk: function(e){

			e.preventDefault();
			
			var page = $('.'+ this.get('classPrefix') +'-paging-input', this.get('el')).val();
			page = parseInt(page, 10);
			
			if (!validate(this, page)) {
				return;
			}

			var onRender = this.get('onRender');
			if (!onRender) {
				return this._onRender(page);
			}

			if (onRender(page) !== false) {
				this.render(page, this.totalPage);
			}
		},
		
		/**
		 * ҳ������������ص�����
		 */
		onInputChanged: function(e) {

			var input = $(e.currentTarget);
			
			var last = input.data('lastValue'),
				value = input.val();
			if (!value || /^[1-9]\d*$/.test(value)) {
				input.data('lastValue', value);
			} else {
				setTimeout(function() {
					input.val(last);
				}, 50);
			}
			
		},
		
		_onRender: function(page) {
			var url = this.get('el').data('url');
			if (url) {
				window.location = url.replace('{page}', page);
			}
		},
		
		/** 
		 * @methed ���ǻ���ʵ�֣����ڴ���templateģ�壬��̬��Ⱦʱ�Żᱻ����
		 */
		handleTpl:function(){
			
			var data = {};
			data.classPrefix = this.get('classPrefix');
			data.linkUrl = this.get('linkUrl') || '';
			TplHandler.process.call(this,data);
		},
			
		/**
		 * ����ģ�����  ע�⣺������������tpl
		 * widget������Զ���{classPrefix}�滻��ʵ�ʵ�className
		 */
		tpl: [
			'<div class="<%= classPrefix %>-paging" data-url="<%= linkUrl %>">',
				'<span class="<%= classPrefix %>-paging-list"></span>',
				'<div class="<%= classPrefix %>-paging-form ">',
					'<span class="<%= classPrefix %>-paging-total">��<em class="<%= classPrefix %>-paging-num"></em>ҳ</span>',						
					'<span class="<%= classPrefix %>-number">',
						'<span>��</span>',
						'<input maxlength="6" class="<%= classPrefix %>-paging-input <%= classPrefix %>-text" autocomplete="off"/>',
						'<span>ҳ</span>',
					'</span>',
					'<span class="<%= classPrefix %>-forward">',
						'<button class="<%= classPrefix %>-paging-btn <%= classPrefix %>-btn">ȷ��</button>',
					'</span>',
				'</div>',
			'</div>'
		].join(''),
	
		end:0
		
	});
	
	
	//private functions
		
	function substitute(str, data){
		return str.replace(/\{(\w+)\}/g, function(r, m){
			return data[m] !== undefined ? data[m] : '{' + m + '}';
		});
    }
	
    function validate( widget, page) {
		var totalPage = widget.totalPage;
		return totalPage === -1 || page > 0 && page <= totalPage;
	}
		
	return Paging;
	
});
