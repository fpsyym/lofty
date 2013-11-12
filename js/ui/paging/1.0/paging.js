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
			currentPage : 1,        			//当前页码
            totalPage : 10,          			//页码总数
			listSize: 9,						//页码出现省略号时，中间显示的页码个数
            hasForm : true,       				//是否存在输入框以及按钮
			showPrevNext:true,					//是否显示“下一页”按钮
            onRender : null,					//点击页码时的回调函数
			linkUrl : null,						//动态渲染分页时，若不传入onRender参数，则点击页码打开linkUrl，格式：http://xxx?page={page} 相对或绝对路径
			classPrefix: 'fui'					//默认的class前缀
		},
		
		/**
		 * 组件内部事件集中在events变量中定义(也可通过bindEvent动态添加事件) 
		 * 其中的{options.classPrefix}会由widget基类自动替代为option中指定的className
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
		 * widget子类的入口函数，需要根据组件逻辑实现
		*/
		_create: function(){
			
			this.totalPage = this.get('totalPage');
			this.currentPage = this.get('currentPage');
			
			this.render();
		},
		
		/**
		 * 组件渲染函数，支持js创建或从dom创建，覆盖基类实现
		*/
		render: function(page, totalPage) {
			
			/**
			 * renderType变量来自widget基类：
			 * 若tpl属性值为html模板字符串，则表示组件将通过JS动态创建，此时renderType为dynamic
			 * 若tpl属性值为Dom选择器，如'#domId'，则表示组件将通过页面上已有的Dom节点创建，此时renderType值为static
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
		 * 创建所有的页码
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

			// 产生除去头尾4个页码的中间页码
			if (from + size - 2 > totalPage) {
				from = totalPage - size + 3;
			} 

			from < 3 && (from = 3);	// 最少从第3页开始
			to = from;
			for (var i = 0; i < size - 4; i++) {
				if (to > totalPage - 2) {
					break;
				}
				html.push(this.createItem(to, to, '', true));
				to++;
			}
			to--;

			// 产生页码2
			if (totalPage > 1) {
				now = Math.floor((from + 1) / 2);
				var item = from > now + 1 ? this.createItem('...', now,  prefix + '-omit') : this.createItem(now, now, '', true);
				html.unshift(item); 
			}

			// 产生页码1
			if (totalPage !== 0) {
				html.unshift( this.createItem(1, 1, '', true));
			}

			// 上一页
			if (showPrev) {
				var cls = currentPage === 1 ? ( prefix +'-prev '+ prefix +'-prev-disabled' ) : ( prefix + '-prev');
				html.unshift( this.createItem('上一页', currentPage - 1, cls));
			}

			// 产生最后第2个页码
			if (totalPage > 2) {
				now = this.totalPage === -1 ? to + 10 : Math.floor((totalPage + to + 1) / 2);
				var item = to < now - 1 ? this.createItem('...', now, prefix + '-omit') : this.createItem(now, now, '', true);
				html.push(item);
			}

			// 产生最后1个页码
			if (this.totalPage !== -1 && totalPage > 3) {
				html.push( this.createItem(totalPage, totalPage, '', true) );
			}

			// 产生下一页
			if (showPrev) {
				var cls = currentPage === totalPage ? ( prefix +'-prev '+ prefix +'-next-disabled' ) : ( prefix + '-prev');
				html.push( this.createItem('下一页', currentPage + 1, cls));
			}
			
			$('.' + this.get('classPrefix') + '-paging-list', this.get('el')).html(html.join(''));
		},
		
		/**
		 * 创建单个页码
		 */
		createItem: function(text, page, className, current) {
			
			var prefix = this.get('classPrefix');
			var tpl = '<a href="#" data-page="{page}" class="{className}">{text}</a>';
			
			if(className === ( prefix+ '-omit')){
				 tpl = '<span class="' + prefix + '-omit">…</span>';
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
		 * 点击页码链接的回调函数
		 */
		onPageLinkClk: function(e){
			
			if (this.get('renderType') == "static") {
				return;
			}
			e.preventDefault();
			
			var elm = $(e.currentTarget);
			
			// 无效页
			var prefix = this.get('classPrefix');
			
			if (elm.hasClass( prefix+ '-current') || 
					elm.hasClass( prefix + '-prev-disabled') || elm.hasClass( prefix + '-next-disabled')) {
				e.preventDefault();
				return;
			}

			// 没提供onRender，作链接跳转
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
		 * 点击分页确定按钮的回调函数
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
		 * 页码输入框的输入回调函数
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
		 * @methed 覆盖基类实现，用于处理template模板，动态渲染时才会被调用
		 */
		handleTpl:function(){
			
			var data = {};
			data.classPrefix = this.get('classPrefix');
			data.linkUrl = this.get('linkUrl') || '';
			TplHandler.process.call(this,data);
		},
			
		/**
		 * 定义模板变量  注意：变量名必须是tpl
		 * widget基类会自动将{classPrefix}替换成实际的className
		 */
		tpl: [
			'<div class="<%= classPrefix %>-paging" data-url="<%= linkUrl %>">',
				'<span class="<%= classPrefix %>-paging-list"></span>',
				'<div class="<%= classPrefix %>-paging-form ">',
					'<span class="<%= classPrefix %>-paging-total">共<em class="<%= classPrefix %>-paging-num"></em>页</span>',						
					'<span class="<%= classPrefix %>-number">',
						'<span>到</span>',
						'<input maxlength="6" class="<%= classPrefix %>-paging-input <%= classPrefix %>-text" autocomplete="off"/>',
						'<span>页</span>',
					'</span>',
					'<span class="<%= classPrefix %>-forward">',
						'<button class="<%= classPrefix %>-paging-btn <%= classPrefix %>-btn">确定</button>',
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
