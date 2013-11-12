/*!!cmd:compress=true*/
/*!!cmd:jsCompressOpt=["--disable-optimizations"]*/

define( 'lofty/ui/suggestion/1.0/suggestion', ['lofty/lang/class', 'lofty/lang/base','lofty/ui/autocomplete/1.0/autocomplete','jquery'], 

function(Class, Base, Autocomplete,$) {
	'use strict';
	
	var Suggestion = Class(Base,{
		defaultOptions:{
			api:"http:\/\/suggest.1688.com\/bin\/suggest", //��ȡ����API
			param:{}, //��Ҫ����ӿڵĲ���
			dataType:'script', //��ѡscript or jsonp
			varName:'_suggest_result_', //�������ݵı�����
			dataSource:handleAjax,
			//renderList:handleData,
			filter:filterData,
			delay:300,
			queryName:'q',
			end:0
		},
		/**
		 * ����ڲ��¼�������events�����ж���(Ҳ��ͨ��bindEvent��̬����¼�) 
		 * ���е�{options.classPrefix}����widget�����Զ����Ϊoption��ָ����className
		*/
		events:{},
		/**
		 * ��ں���
		 * @param  {object} ���ò���������Ĳ���������Ĭ������}
		 * @descrpition ���ݴ������������AutoComplete�������ʵ��
		 */
		init: function(config){
			var self = this;
			this.options = $.extend(true, {}, this.defaultOptions, config);
			this.suggestion = new Autocomplete(this.options);

			//���¼�
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
	 * ��ȡ�첽����
	 * @descrpition �����첽�ӿڣ���ȡ����
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
	 * ����ģ��
	 * @descrpition ����չʾ��htmlģ��
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
	 * ���ݸ�Ԥ
	 * @descrpition ������ݲ�����Ĭ�ϸ�ʽ�������ô˷���ת������
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