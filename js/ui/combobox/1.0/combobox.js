/*!!cmd:compress=true*/
/*!!cmd:jsCompressOpt=["--disable-optimizations"]*/

/**
 * @module fdui/ui/combobox
 * @from 
 * @author chuanpeng.qchp
 * @date 20130731
 * */
  
define( 'lofty/ui/combobox/1.0/combobox', ['lofty/lang/class', 'lofty/ui/widget/1.0/widget','lofty/util/template/1.0/tplhandler','jquery'], 
	
  function( Class, Widget,TplHandler,$){
  'use strict';
    	
    var Combobox = Class( Widget, {
		options:{
			readonly:false,         //文本框是否可以编辑，默认编辑
			disabled:false,            //组件是否禁用
			name:"",                //表单提交时的name值
			itemList:[],            //可以是数组，原生select的选择器的字符串，或者自定义的数据源
			showListener:"click",   //可选项 click mouseenter
			height:26,              //height:可选的值为 22和26
			classPrefix: 'fui-combobox'		//默认的class前缀
		},
		/**
		 * widget子类的入口函数，需要根据组件逻辑实现
		 * node为组件的父容器
		*/
		_create: function(){
			this.render();
			initOptions.call(this);
			this.renderItemList();
		},
		events:{
			'.trigger,.result':{
				'{options.showListener}':bindShowItemEvent
			},
			'.{options.classPrefix}-item':{
				'click':bindClickItemEvent,
				'mouseenter':bindHoverItemEvent,
				'mouseleave':bindLeaveItemEvent
			},
			'document':{
				'click':bindClickDoc
			}
		},
		renderItemList:function(){
			var itemList = this.get('itemList');
			var prefix = this.get('classPrefix');
			var i,j,panelList = [];
			panelList.push('<div class="list fd-clr"><ul>');
			for(i = 0,j = itemList.length;i<j;i++)
			{
				panelList.push('<li class="');
				panelList.push(prefix);
				if(itemList[i].selected){
					panelList.push('-item ');
					panelList.push(prefix);
					panelList.push('-selected">');
					this.setText(itemList[i].txt);
					this.setValue(itemList[i].val);
				}else{
					panelList.push('-item">');
				}
				
				panelList.push(itemList[i].txt);
				panelList.push('</li>');
			}
			panelList.push('</ul></div>');
			this.get('el').find("." + prefix + "-panel").html(panelList.join(''));
		},
		updateItemList:function(itemList){
			this.set("itemList",itemList,{silent:true});
			this.renderItemList();
			return this;
		},
		addItem:function(idx,item){
			var itemList = this.get("itemList");
			if(!item){
				item = idx;
				idx = undefined;
			}
			if(idx){
				itemList.splice(idx,0,item);
			}
			else{
				itemList.push(item);
			}
			this.updateItemList(itemList);
			return this;
		},
		removeItem:function(idx){
			var itemList = this.get("itemList");
			itemList.splice(idx,1);
			this.updateItemList(itemList);
			return this;
		},
		getItemList:function(){
			return this.get("itemList");
		},
		getText:function(){
			return this.text;
		},
		setText:function(txt){
			this.get('el').find(".result").val(txt);
			this.text = txt;
			return this;
		},
		getValue:function(){
			return this.value;
			
		},
		setValue:function(val){
			if(this.get('name')){
				this.get('el').find(".field").val(val);
			}
			this.value = val;
			return this;
		},
		setIndex:function(idx){
			var prefix = this.get('classPrefix');
			var el = this.get('el');
			var item = el.find("." + prefix + "-item:eq(" + idx + ")");
			if(!item.hasClass(prefix + "-selected")){
				el.find("." + prefix + "-item").removeClass(prefix + "-selected");
				item.addClass(prefix + "-selected");
				this.setText(item.html());
				this.setValue(this.get('itemList')[idx].val);
				this.trigger("change",{
					val: this.getValue(),
					txt: this.getText()
				});
			}
			return this;
		},
		
		handleTpl:function(){
			var data = {
				classPrefix:this.get('classPrefix'),
				itemList:this.get('itemList'),
				readonly:this.get('readonly'),
				disabled:this.get('disabled'),
				name:this.get('name'),
				height:this.get('height')
			};			
			TplHandler.process.call(this,data);
		},
		setReadonly:function(isReadonly){
			var prefix = this.get('classPrefix');
			var resultInput = this.get('el').find(".result");
			if(isReadonly){
				if(resultInput.attr("readonly") !== "readonly"){
					resultInput.attr("readonly","readonly");
				}
			}
			else{
				if(resultInput.attr("readonly") === "readonly"){
					resultInput.removeAttr("readonly");
				}
			}
			return this;
		},
		setDisabled:function(isDisabled){
			var prefix = this.get('classPrefix');
			var resultInput = this.get('el').find(".result");
			if(isDisabled){
				if(resultInput.attr("disabled") !== "disabled"){
					resultInput.attr("disabled","disabled");
					this.get('el').addClass(prefix + "-disabled");
				}
			}
			else{
				if(resultInput.attr("disabled") === "disabled"){
					resultInput.removeAttr("disabled");
					this.get('el').removeClass(prefix + "-disabled");
				}
			}
			return this;
		},
		clickItem:function(item){
			var prefix = this.get('classPrefix');
			var allItem = this.get('el').find("." + prefix + "-item");
			allItem.removeClass(prefix + "-selected");
			$(item).addClass(prefix + "-selected");
			var idx = allItem.index(item);
			this.setText($(item).html());
			this.setValue(this.get('itemList')[idx].val);
			this.trigger("change",{
				val: this.getValue(),
				txt: this.getText()
			});
		},
		
		/**
		 * 定义模板变量  注意：变量名必须是tmpl
		 * widget基类会自动将{classPrefix}替换成实际的className
		 */
		tpl:[
			'<div class="<%= classPrefix %><% if(height === 26){ %> <%= classPrefix %>-l <% } %><% if(disabled === true){ %> <%= classPrefix %>-disabled <% } %>">',
				'<input class="result" type="text" <% if(disabled === true){ %> disabled="disabled" <% } %> <% if(readonly === true){ %> readonly="readonly" <% } %> autocomplete="off">',
				'<a class="trigger" href="#" target="_self" hidefocus="true"></a>',
				'<div class="<%= classPrefix %>-panel"></div>',
			'</div>'
		].join(''),
		end:0
		
	});
	function initOptions(){
		var data = this.get('itemList');
		//当数据源为原生select时，需要初始化item
		if(typeof data === "string" && $(data).is('select')){
			var $select = $(data);
			if($select.attr("name")){
				this.set('name',$select.attr("name"));
			}
			data = [];
			this.set('itemList',data);
			var item;
			$.each($select.find('option'),function(idx,op){
				item = {
					txt:$(op).html(),
					val:$(op).val()
				};
				if($(op).attr("selected")){
					item.selected = "selected";
				}
				data.push(item);
			});
			$select.remove();
		}
		if(this.get('name')){
			this.get('el').prepend('<input type="hidden" class="field" name="' + this.get('name') + '"></input>');
		}
	}
	function bindShowItemEvent(e){
		e.preventDefault();
		var prefix = this.get('classPrefix');
		if(!this.get('el').hasClass(prefix + "-disabled")){
			this.get('el').find("." + prefix + "-panel").css("display","block");
		}
		if(!this.hasFired){
			var event = this.get('showListener');
			if(event === "mouseenter")
			{
				this.get('el').find(".trigger").on("click",function(e){
					e.preventDefault();
				})
				var self = this;
				this.get('el').on("mouseleave",function(){
					if(!self.get('el').hasClass(prefix + "-disabled")){
						self.get('el').find("." + prefix + "-panel").css("display","none");
					}
				});
			}
			this.hasFired = true;
		}
		
	}

	function bindClickItemEvent(e){
		var item = e.target;
		var prefix = this.get('classPrefix');
		if(!$(item).hasClass(prefix + "-selected"))
		{
			this.clickItem(item);
		}
		$(item).parents("." + prefix + "-panel").css("display","none");
	}
	function bindHoverItemEvent(e){
		var prefix = this.get('classPrefix');
		$(e.target).addClass(prefix + "-hover");
	}
	function bindLeaveItemEvent(e){
		var prefix = this.get('classPrefix');
		$(e.target).removeClass(prefix + "-hover");
	}
	function bindClickDoc(e){
		var prefix = this.get('classPrefix');
		var self = this;

		if(e.srcElement !== self.get('el').find(".trigger")[0] 
			&&  e.srcElement !== self.get('el').find(".trigger .triangle-icon")[0]
			&&  e.srcElement !== self.get('el').find(".result")[0])
		{
			self.get('el').find("." + prefix + "-panel").css("display","none");
		}
	}
	return Combobox;
} );
