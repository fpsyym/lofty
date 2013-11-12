/*!!cmd:compress=true*/
/*!!cmd:jsCompressOpt=["--disable-optimizations"]*/

define( 'lofty/ui/suggestion/1.0/suggestion', ['lofty/lang/class', 'lofty/lang/base','lofty/ui/autocomplete/1.0/autocomplete','jquery'], 

function(Class, Base, Autocomplete,$) {
	'use strict';
	
	var Suggestion = Class(Base,{
		defaultOptions:{
			api:"http:\/\/suggest.1688.com\/bin\/suggest", //获取数据API
			param:{}, //需要传入接口的参数
			dataType:'script', //可选script or jsonp
			varName:'_suggest_result_', //返回数据的变量名
			dataSource:handleAjax,
			//renderList:handleData,
			filter:filterData,
			delay:300,
			queryName:'q',
			end:0
		},
		/**
		 * 组件内部事件集中在events变量中定义(也可通过bindEvent动态添加事件) 
		 * 其中的{options.classPrefix}会由widget基类自动替代为option中指定的className
		*/
		events:{},
		/**
		 * 入口函数
		 * @param  {object} 配置参数，传入的参数将覆盖默认配置}
		 * @descrpition 根据传入参数，调用AutoComplete组件生成实例
		 */
		init: function(config){
			var self = this;
			this.options = $.extend(true, {}, this.defaultOptions, config);
			this.suggestion = new Autocomplete(this.options);

			//绑定事件
			this.on('dataReady',function(data){
				this.suggestion.trigger('dataReady',data);
			});
			this.suggestion.on('select',function(){
				self.trigger('select');
			});
		},
		resetPosition:function(){
			this.suggestion.resetPosition();
			return this;
		},
		setDisabled:function(isDisabled){
			this.suggestion.setDisabled(isDisabled);
			return this;
		},
		
		end:0
	});
	/**
	 * 获取异步数据
	 * @descrpition 调用异步接口，获取数据
	 */
	function handleAjax () {
		var self =this,
			api = this.get('api'),
			param = this.get('param'),
			varName = this.get('varName'),
			dataType  = this.get('dataType'),
			value = $(this.get('target')).val();

		param[this.get('queryName')] = value;

		$.ajax(api,{
            dataType: dataType,
            cache: false,
            data: param
        }).done(function(o){
        	var result = dataType==='script'? window[varName].result : o.result;
        	(typeof result !== 'undefined') && self.trigger("dataReady",result);
        	
        });
	};

	/**
	 * 数据模板
	 * @descrpition 数据展示的html模板
	 */

/*	function handleData(){
		var dataList = this.dataList,itemList = [];
		itemList.push('<ul>');
		for(var i=0,j=dataList.length;i<j;i++){
			itemList.push('<li class="fui-autocomplete-item fd-clr">');
			itemList.push('<span class="fd-left">');
			itemList.push(dataList[i][0]);
			itemList.push('</span>');
			itemList.push('<span class="fd-right">');
			itemList.push(dataList[i][1]);
			itemList.push('</span>');
			itemList.push('</li>');
		}
		itemList.push('</ul>');
		this.get('el').html(itemList.join(''));

	};
*/
	/**
	 * 数据干预
	 * @descrpition 如果数据不符合默认格式，可以用此方法转换数据
	 */

	function filterData(dataList,query){
		var _dataArr = [];

		if(typeof dataList === 'undefined' || dataList.length===0){
			return dataList;
		}
		for (var i = 0; i < dataList.length; i++) {
			var _dataItem = dataList[i],
				_dataObj = {};
			_dataObj.label = replaceStr(_dataItem[0],query);
			_dataObj.desc = _dataItem[1];
			_dataArr.push(_dataObj);
		};
		return _dataArr;

	};
	function replaceStr (str,query) {
		var s = '_'+query+'%';
		if(str.indexOf(s).length!==-1){
			str = str.replace(s,'<b>'+query+'</b>');
		}
		return str;
	}
	return Suggestion;

});