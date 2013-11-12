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
			width:"auto", //Ĭ��Ϊ��targetԪ�ر���һ�����
			disabled:false, //Ĭ������
			autoFocus:true, //�Ƿ��Զ�ѡ�е�һ�Ĭ��true
			dLeft:0,    //����΢������Ϊ����ʱ��ʾ����΢��
			dTop:0,     //����΢������Ϊ����ʱ��ʾ����΢��
			delay:0, //target����change�¼�ʱ��ȥ�ɼ����ݵ��ӳ�ʱ�䣬������Ϊ��������ʱ������Ϊ0����Ϊ�첽����ʱ���Ƽ�����Ϊ300
			minLength:1, //�����ɼ�����ʱ��target���ַ�������̳���
			submitOnEnter:true,//��targetԪ��Ϊ���е�Ԫ��ʱ���س��Ƿ��ύ��Ĭ���ύ
			filter:Filter.startsWith,//�����ݼ����й�����ʾ���������У������첽�������ݵ������һ������filterΪnull����ַ���
			locator:"data",
			autoHide:true,
			renderList:renderList,
			dataSource:null,   //����������||object||function ��locator���ʹ������λ�������б��е�����
			classPrefix:"fui-autocomplete",
			itemClass:"fui-autocomplete-item",
			currentItemClass:"fui-autocomplete-current-item"
		},
		/**
		 * ����ڲ��¼�������events�����ж���(Ҳ��ͨ��bindEvent��̬����¼�) 
		 * ���е�{options.classPrefix}����widget�����Զ����Ϊoption��ָ����className
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
		 * widget�������ں�������Ҫ��������߼�ʵ��
		 * nodeΪ����ĸ�����
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
		 * ����ģ�����  ע�⣺������������tmpl
		 * widget������Զ���{classPrefix}�滻��ʵ�ʵ�className
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
		// �Ƿ���ֹ�س��ύ��
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

	// ѡ�������ƶ�
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
	// ͨ�� locator �ҵ� data �е�ĳ�����Ե�ֵ
    // 1. locator ֧�� function����������ֵΪ���
    // 2. locator ֧�� string������֧�ֵ������Ѱַ
    //     data {
    //       a: {
    //         b: 'c'
    //       }
    //     }
    //     locator 'a.b'
    // ���ķ���ֵΪ c
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
			// ���й���
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
		
		//���ÿ�Ⱥ�λ��
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
