/*!!cmd:compress=true*/
/*!!cmd:jsCompressOpt=["--disable-optimizations"]*/

/**
 * @module fdui/ui/autocomplete
 * @from 
 * @author chuanpeng.qchp
 * @date 20130822
 * */
 
define( 'lofty/ui/autocomplete/1.0/autocomplete', 
	  ['lofty/lang/class', 
	   'lofty/ui/widget/1.0/widget',
	   'lofty/util/template/1.0/tplhandler',
	   'lofty/ui/autocomplete/1.0/filter',
	   'jquery'], 
	
  function( Class, Widget,TplHandler,Filter,$){
  'use strict';
    // keyCode
    var KEY = {
        UP: 38,
        DOWN: 40,
        LEFT: 37,
        RIGHT: 39,
        ENTER: 13,
        ESC: 27,
        BACKSPACE: 8
    };
	
    var Autocomplete = Class( Widget, {
		
		options:{
			target:"",
			width:"auto", //默认为跟target元素保持一样宽度
			disabled:false, //默认启用
			autoFocus:true, //是否自动选中第一项，默认true
			dLeft:0,    //向左微调，当为负数时表示向右微调
			dTop:0,     //向上微调，当为负数时表示向下微调
			delay:0, //target触发change事件时，去采集数据的延迟时间，当数据为本地数据时，设置为0，若为异步请求时，推荐设置为300
			minLength:1, //触发采集数据时，target中字符数的最短长度
			submitOnEnter:true,//当target元素为表单中的元素时，回车是否提交，默认提交
			filter:Filter.startsWith,//对数据集进行过滤显示在下拉框中，对于异步请求数据的情况，一般设置filter为null或空字符串
			locator:"data",
			autoHide:true,
			renderList:renderList,
			dataSource:null,   //可以是数组||object||function 与locator配合使用来定位到下拉列表中的数据
			classPrefix:"fui-autocomplete",
			itemClass:"fui-autocomplete-item",
			currentItemClass:"fui-autocomplete-current-item"
		},
		/**
		 * 组件内部事件集中在events变量中定义(也可通过bindEvent动态添加事件) 
		 * 其中的{options.classPrefix}会由widget基类自动替代为option中指定的className
		*/
		events:{
			'.{options.itemClass}': {
				'mouseenter':onItemHover,
				'click':onItemClick
			},
			'':{
				'mouseenter':onListEnter,
				'mouseleave':onListLeave
			}
		},
		/**
		 * widget子类的入口函数，需要根据组件逻辑实现
		 * node为组件的父容器
		*/
		_create: function(){
			bindTargetEvent.call(this);
			
			this.render();
			var self = this;
			this.on("dataReady",function(){
				onDataReady.call(self,arguments);
			});
		},
				
		
		handleTpl:function(){
			var data = {};
			data.classPrefix = this.get('classPrefix');
			TplHandler.process.call(this,data);
		},
		resetPosition:function(){
			var target = this.get('target');
			var tX = $(target).offset().left,
				tY = $(target).offset().top,
				tH = $(target).outerHeight(),tW;
			if(this.get('width') === 'auto'){
				tW = $(target).outerWidth();
			} else {
				tW = this.get('width');
			}
			this.get('el').css("width",(tW - 2) + "px");
			setPosition.call(this,tX,tY + tH);
			return this;
		},
		setDisabled:function(isDisabled){
			
			this.set('disabled',isDisabled);
			if(isDisabled){
				clearTimeout(self.timeoutId);
				unbindTargetEvent.call(this);
				if(!this.get('el').is(":hidden")){
					this.get('el').hide();
				}
			} else {
				bindTargetEvent.call(this);
			}
			return this;
		},
		/**
		 * 定义模板变量  注意：变量名必须是tmpl
		 * widget基类会自动将{classPrefix}替换成实际的className
		 */
		tpl:[
			'<div class="<%= classPrefix %>">',
			'</div>'
		].join(''),
		end:0
		
	});
	function setPosition(x,y){
		var dl = this.get('dLeft'),dt = this.get('dTop');
		var left = x - dl,top = y - dt;
		this.get('el').css({
			'top':top,
			'left':left
		});		
	}
	function renderList(){
		var autoFocus = this.get('autoFocus');
		var itemCls = this.get('itemClass');
		var cItemCls = this.get('currentItemClass');
		var itemList = [];
		itemList.push('<ul>');
		for(var i=0,j=this.dataList.length;i<j;i++){
			if(i===0 && autoFocus){
				itemList.push('<li class="' + itemCls + ' ' + cItemCls + '">');
			}
			else{
				itemList.push('<li class="' + itemCls + '">');
			}
			itemList.push(this.dataList[i].label);
			itemList.push('</li>');
		}
		itemList.push('</ul>');
		var html = itemList.join('');
		this.get('el').html(html);
	}
	function onListEnter(e){
		this.ListEnter = true;
	}
	function onListLeave(e){
		delete this.ListEnter;
	}
	function onItemHover(e){
		var itemCls = this.get('itemClass');
		var cItemCls = this.get('currentItemClass');
		this.get('el').find('.' + itemCls).removeClass(cItemCls);
		$(e.currentTarget).addClass(cItemCls);
	}	
	function onItemClick(e){
		var itemCls = this.get('itemClass');
		var target = this.get('target');
		var idx = this.get('el').find('.' + itemCls).index(e.currentTarget);
		$(target).val(this.dataList[idx].label);
		this.get('el').hide();
		this.get('el').html('');
		this.trigger("select");
	}
	function keyUp(e) {
		e.preventDefault();
		var itemCls = this.get('itemClass');
		var cItemCls = this.get('currentItemClass');
		
		if(!this.get('el').is(":hidden")){
			stepMove.call(this,-1);
		}else{
			if (this.get('el').find('.'+itemCls).length) {
				this.get('el').show();
			} 
		}
	}

	function keyDown(e) {
		e.preventDefault();
		var itemCls = this.get('itemClass');
		var cItemCls = this.get('currentItemClass');
		
		if(!this.get('el').is(":hidden")){
			stepMove.call(this,1);
		}else{
			if (this.get('el').find('.'+itemCls).length) {
				this.get('el').show();
			} 
		}
	}

	function keyEnter(e) {
		// 是否阻止回车提交表单
		if (!this.get('submitOnEnter')) {
			e.preventDefault();
		}
		var itemCls = this.get('itemClass');
		var cItemCls = this.get('currentItemClass');
		var target = this.get('target');

		if(!this.get('el').is(":hidden") && this.get('el').find('.' + cItemCls).length){
			var idx = this.get('el').find('.' + itemCls).index(this.get('el').find('.' + cItemCls)[0]);
			$(target).val(this.dataList[idx].label);
			this.get('el').hide();
			this.get('el').html('');
			this.trigger("select");
		}
		
	}

	// 选项上下移动
	function stepMove(direction) {
		var itemCls = this.get('itemClass');
		var cItemCls = this.get('currentItemClass');
		var items = this.get('el').find('.' + itemCls);
		var currentItem = this.get('el').find('.' + cItemCls);
		if(currentItem.length === 0){
			$(items[0]).addClass(cItemCls);
			return;
		}
		var cidx = items.index(currentItem[0]);
		cidx += direction;
		if(cidx === items.length){
			cidx = 0;
		} else if(cidx === -1){
			cidx = items.length -1;
		}
		this.get('el').find('.' + cItemCls).removeClass(cItemCls);
		$(items[cidx]).addClass(cItemCls);
	}
		
	function targetKeyDownEvent(e){
		switch (e.which) {
			case KEY.ESC:
				this.get('el').hide();
				break;

			// top arrow
			case KEY.UP:
				keyUp.call(this,e);
				break;

			// bottom arrow
			case KEY.DOWN:
				keyDown.call(this,e);
				break;

			// left arrow
			case KEY.LEFT:
			// right arrow
			case KEY.RIGHT:
				break;

			// enter
			case KEY.ENTER:
				keyEnter.call(this,e);
				break;
		}
	}
	function targetValueChange(e){
		var delay = this.get('delay') , 
			minLen = this.get('minLength');
			
		if($(e.currentTarget).val().length >= minLen){
			var dataList;
			if(delay === 0){
				this.queryValue = $(e.currentTarget).val();
				showItemList.call(this);
			}
			else{
				clearTimeout(this.timeoutId);
				var self = this;
				this.timeoutId = setTimeout(function(){
					if($(e.currentTarget).val().length >= minLen){
						self.queryValue = $(e.currentTarget).val();
						showItemList.call(self);
					}
				},delay);
			}
		}
		else{
			if(!this.timeoutId){
				clearTimeout(this.timeoutId);
			}
			this.get('el').html('');
			this.get('el').hide();
		}
	}
	function targetBlurEvent(){
		if(!this.get('autoHide')){
			return;
		}
		if(this.ListEnter) {
			return;
		}
		this.get('el').hide();
	}
	function bindTargetEvent(){
		if (this.get('disabled')) return;
		var target = this.get('target');
		var prefix = this.get('classPrefix');
		var self = this;
		$(target).on('keydown.' + prefix + 'target',function(e){
			targetKeyDownEvent.call(self,e);
		});
		if($.browser.msie && ($.browser.version === '9.0')){
			$(target).on('keyup.ie9Backspace',function(e){
				if(e.which === KEY.BACKSPACE){
					targetValueChange.call(self,e);
				}
			});
			$(target).on('cut.ie9cut',function(e){
				setTimeout(function(){
					targetValueChange.call(self,e);
				},0)
			});
			
		}
		$(target).on('input.' + prefix + 'target',function(e){
			targetValueChange.call(self,e);
		});
		$(target).on('propertychange.' + prefix + 'target',function(e){
			targetValueChange.call(self,e);
		});
		$(target).on('blur.' + prefix + 'target',function(e){
			targetBlurEvent.call(self,e);
		});
	}
	function unbindTargetEvent(){
		var target = this.get('target');
		var prefix = this.get('classPrefix');
		$(target).off('keydown.' + prefix + 'target');
		$(target).off('input.' + prefix + 'target');
		$(target).off('propertychange.' + prefix + 'target');
		$(target).off('blur.' + prefix + 'target');
		if($.browser.msie && ($.browser.version === '9.0')){
			$(target).off('keyup.ie9Backspace');
			$(target).off('cut.ie9cut');
		}
	}
	
	function showItemList(){
		var dataSource = this.get('dataSource');
		var dataList;
		if(isArray(dataSource)){
			dataList = dataSource;
		}else if(isObject(dataSource)){
			var locator = this.get('locator');
			dataList = locateResult.call(this,locator,dataSource);
		}else if(isFunction(dataSource)){
			dataList = dataSource.call(this);
		}
		if(dataList)
		{
			this.trigger("dataReady",dataList);
		}
	}
	// 通过 locator 找到 data 中的某个属性的值
    // 1. locator 支持 function，函数返回值为结果
    // 2. locator 支持 string，而且支持点操作符寻址
    //     data {
    //       a: {
    //         b: 'c'
    //       }
    //     }
    //     locator 'a.b'
    // 最后的返回值为 c
    function locateResult(locator, data) {
        if (!locator) {
            return data;
        }
        if ($.isFunction(locator)) {
            return locator.call(this, data);
        } else if (isString(locator)) {
            var s = locator.split('.'), p = data;
            while (s.length) {
                var v = s.shift();
                if (!p[v]) {
                    break;
                }
                p = p[v];
            }
            return p;
        }
        return data;
    }
	
	function onDataReady(dataList){
		dataList = dataList[0];
		var clsPrefix = this.get('classPrefix');
		if(isObject(dataList)){
			var locator = this.get('locator');
			dataList = locateResult.call(this,locator,dataList);
		}
		var filter = this.get('filter');
		if(filter){
			// 进行过滤
			dataList = filter.call(this, dataList, this.queryValue);
		}
            
		if(dataList.length === 0){
			this.get('el').hide();
			this.get('el').html('');
			delete this.dataList;
			return;
		}
		this.dataList = dataList;

		this.get('renderList').call(this);
		
		//重置宽度和位置
		if(this.get('el').is(":hidden")){
			this.resetPosition();
			this.get('el').show();
		}
	}
	
	var toString = {}.toString,
		isFunction = function( o ){
			return toString.call( o ) === '[object Function]';
		},
		isString = function( o ){
			return 'string' === typeof o;
		},
		isArray = function( o ){
			return toString.call( o ) === '[object Array]';
		},
		isObject = function(o){
			return toString.call( o ) === '[object Object]';
			
		};
	return Autocomplete;
} );
