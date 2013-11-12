/*!!cmd:compress=true*/
/*!!cmd:jsCompressOpt=["--disable-optimizations"]*/

define( 'lofty/ui/suggestion/1.0/suggestion.all', ['lofty/lang/class', 'lofty/lang/base','lofty/ui/autocomplete/1.0/autocomplete','jquery'], 

function(Class,Base, Autocomplete,$) {
	'use strict';
	
	var Suggestion = Class(Base, {
		defaultOptions:{
			api:"http:\/\/suggest.1688.com\/bin\/suggest", //��ȡ����API
			oneWidth:'auto',
			allWidth:368,
			allBtnTrigger:'trigger',
			param:{}, //��Ҫ����ӿڵĲ���
			dataType:'script', //��ѡscript or jsonp
			varName:'_suggest_result_', //�������ݵı�����
			dataSource:handleAjax,
			renderList:handleData,
			filter:filterData,
			delay:300,
			title:'',
			queryName:'q',
			classPrefix:'fui-suggestion',
			itemClass:"fui-suggestion-item",
			currentItemClass:"fui-suggestion-current-item",
			end:0
		},

		/**
		 * ��ں���
		 * @param  {object} ���ò���������Ĳ���������Ĭ������}
		 * @descrpition ���ݴ������������AutoComplete�������ʵ��
		 */
		init: function(config){
			var self = this;
			this.options = $.extend(true, {}, this.defaultOptions, config);
			this.suggestion = new Autocomplete(this.options);
			bindTargetEvent.call(this);
			
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
			value = $(this.get('target')).val(),
			placeholder = $(this.get('target')).attr('placeholder');

		(value === placeholder || this.get('getAllResult')) && (value='');

		param[this.get('queryName')] = value;
		this._oneCol = true;

		$.ajax(api,{
            dataType: dataType,
            cache: false,
            data: param
        }).done(function(o){
        	var result = dataType==='script'? window[varName].result : o.result;
        	(value===''||value === placeholder) && (delete self._oneCol);
        	(typeof result !== 'undefined') && self.trigger("dataReady",result);
        	self.resetPosition()
        	self.set('getAllResult',false);
        });
	};
	function bindTargetEvent(){
		var self = this,
			target = $(this.options.target),
			prefix = this.options.classPrefix || 'fui-autocomplete',
			allBtnTrigger = $('.'+this.options.allBtnTrigger);
		//��������ý����¼�
		target.on('focus.'+ prefix + 'target',function(e) {
			//self.suggestion.set('getAllResult',true);
			$(this).trigger("keydown." + prefix + 'target');
			$(this).trigger("keyup." + prefix + 'target');
		});
		//�����н��������ť�¼�
		allBtnTrigger.on('click',function(e){
			self.suggestion.set('getAllResult',true)
			target.focus();
		})
	};
	/**
	 * ����ģ��
	 * @descrpition ����չʾ��htmlģ��
	 */

	function handleData(){
		var dataList = this.dataList,
			map = {},
			len = 0,
			k,
			itemList = [],
			itemCls = this.get('itemClass'),
			oneCol = this._oneCol,
			oneWidth = this.get('oneWidth');
		$.each(dataList,function(i,item){
			var label = item.label,
				index = oneCol ? '':item.index;
			if(map[index] === undefined){
				map[index] = [];
				len += 1;
			};
			map[index].push('<span class='+ itemCls +'>'+label+'</span>')
		});

		itemList.push('<div class="'+this.get("classPrefix")+'-t">'+this.get("title")+'</div>');
		itemList.push('<div class="'+this.get('classPrefix')+'-cont">');
		for (k in map) {
            itemList.push('<dl>');
            itemList.push('<dt>' + k.toUpperCase() + '</dt>');
            itemList.push('<dd>');
            itemList.push(map[k].join(''));
            itemList.push('</dd>');
            itemList.push('</dl>');
        }
		itemList.push('</div>');
		this.get('el').html(itemList.join(''));
		if(oneCol){
			oneWidth === 'auto' && this.set('oneWidth',$(this.get('target')).outerWidth() + $('.'+this.get('allBtnTrigger')).outerWidth());
			this.get('el').addClass('fui-suggestion-onecol');
			this.set('width',this.get('oneWidth'));

		}else{
			this.get('el').removeClass('fui-suggestion-onecol');
			this.set('width',this.get('allWidth'));
		}
	};

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
			_dataObj.index = _dataItem[1];
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