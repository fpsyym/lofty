/*!!cmd:compress=true*/
/*!!cmd:jsCompressOpt=["--disable-optimizations"]*/

/**
 * @module lofty/alicn/geoInfo
 * @author daxuan.shedx
 * @date 23/08/2013
 * 行政区划多级联动组件
 * */

define('lofty/alicn/geoinfo/1.0/geoinfo', ['lofty/ui/widget/1.0/widget',
                                       'lofty/lang/class',
                                       'lofty/ui/combobox/1.0/combobox',
                                       'lofty/util/template/1.0/tplhandler',
                                       'jquery'] ,
	function(Widget, Class, Combobox, TplHandler,$){
	'use strict';
	var Geoinfo = Class(Widget,{
		data: {},
		totalLevel:0 ,
		levelCombobox : [],
		targetData: {},
		options:{     						
			data: null,					//CBU地区码数据
			displayType: 'comboBox',			//展示方式
			requireIpMatching: false,			//是否需要ip匹配地区
			classPrefix: 'fui-geoinfo',			//默认的class前缀,
			dataInterface: "http://my.1688.com/member/joinFormCompanyAreaInterface.do"
		},
		_create: function(){
			this.targetData.name = [];
			this.targetData.code = [];
			this.parent = this.get('container');
			this._prepareData(this._dataRender);
		},
		_dataRender: function(data){
			var self = this;
			this.render();
			this._prepareData(function(data){
				self.data = data;
				self._renderLevel(null,0);
			});
		},
		_generateLevel: function(data,keyChain,levelData){
			var resultList = [],originalData = {},result = {};
			if(keyChain === null){
				for(var key in data){
					var geoKey = data[key];
					
					if(geoKey !== null){
						//Object {中国_CN: Object}，这样的数据结构,只能这样取值，太搓了
						for(var realKey in geoKey){
							originalData[realKey] = {};
							originalData[realKey] = geoKey[realKey];
							if(realKey !== null && typeof(realKey) === "string"){
									var realKeyParts = realKey.split("_"), resultObj = {};
									resultObj.val = realKeyParts[1];
									resultObj.txt = realKeyParts[0];
									resultList.push(resultObj);
								break;
							}
						}
					}
				}
				result.resultList = resultList;
				result.originalData = originalData;
				return result;
			}else{
				//最后一级数据是数组不是对象
				if(!$.isArray(levelData)){
					for(var subKey in levelData){
						if(subKey != null && typeof(subKey) === "string"){
							var subKeyParts = subKey.split("_"), resultObj = {};
							resultObj.val = subKeyParts[1];
							resultObj.txt = subKeyParts[0];
							resultList.push(resultObj);
							originalData[subKey] = levelData[subKey];
						}
					}					
					result.resultList = resultList;
					result.originalData = originalData;
					return result;
				}else{
					for(var index in levelData){
						if(levelData[index] != null && typeof(levelData[index]) === "string"){
							var subKeyParts = levelData[index].split("_"), resultObj = {};
							resultObj.val = subKeyParts[1];
							resultObj.txt = subKeyParts[0];
							resultList.push(resultObj);
							originalData[levelData[index]] = {};
						}
					}
					result.resultList = resultList;
					result.originalData = originalData;
					return result;
				}
			}
		},	
		/**
		 * override父类
		 */
		handleTpl:function(){
			var data = {};
			data.classPrefix = this.get('classPrefix');
			TplHandler.process.call(this,data);
		},
		setData: function(data){
			this.set('data',data);
			this._prepareData(this._dataRender);
		},
		setDataSource: function(source){
			this.set('dataInterface',source);
		},
		_prepareData: function(callback){
			var self = this;
			$.ajax({
				url: this.get('dataInterface'),
				dataType : 'script',
				success: function(){
					var data = window.countryAreaData;
					callback.call(self,data);	
				}
			});
		},
		_renderLevel: function(dataKey,i,parentData){
			var level = $('div.lv'+i,this.parent) ,self = this;
			if(level.length > 0){
				var levelResult = this._generateLevel(this.data,dataKey,parentData), 
					levelData = levelResult.resultList;
				this.levelCombobox[i].updateItemList(levelData);
				
			}else{
				$('div.'+this.get('classPrefix')+'-wrapper',this.parent).append($('<div class="'+this.get('classPrefix')+'-level lv'+i+'"></div>'));
				var level = $('div.lv'+i,this.parent) ,self = this;
				var currentlevelCombobox = new Combobox({
					container:level,
					readonly:false
				});
				var levelResult = this._generateLevel(this.data,dataKey,parentData), 
					levelData = levelResult.resultList;
				this.levelCombobox.push(currentlevelCombobox);
				currentlevelCombobox.updateItemList(levelData);
				//处理直辖市问题
				if(levelData.length === 1){
					currentlevelCombobox.setDisabled(true);
					var autoArg = levelData[0];				
					self._selectLogic(autoArg , i, levelResult);
				}
				i++;
				this.totalLevel = i;
				currentlevelCombobox.on('change',function(arg){
					self._selectLogic(arg , i, levelResult);
				});
				
				var dataAs = this.get('data');
				if($.isArray(dataAs) && dataAs[i - 1] != null){
					$(levelData).each(function(index,data){
						if(data.val === dataAs[i - 1] || data.txt === dataAs[i - 1]){
							$('li.fui-combobox-item',level).eq(index).click();
						}
					});					
					currentlevelCombobox.setDisabled(true);
				}
			}
		},
		_selectLogic : function(arg, i, levelResult){
			var self = this, argDataKey = null, k = i, finalLevel = false;
			
			if(arg !== null){
				argDataKey = arg.txt + "_" + arg.val;
				this.levelCombobox = this.levelCombobox.slice(0,k-1);
				this.targetData.name = this.targetData.name.slice(0,k - 1);
				this.targetData.code = this.targetData.code.slice(0,k - 1);
				this.targetData.name.push(arg.txt);
				this.targetData.code.push(arg.val);
			}
			//隐藏此修改level之上的level
			for(k = i ; k <= self.totalLevel; k ++ ){
				var levelHide = $('div.lv'+k,this.parent);
				if(levelHide.length > 0){
					levelHide.remove();
				}
			}
			if(levelResult.originalData[argDataKey] != null && typeof(levelResult.originalData[argDataKey]) === "object"){
				if(Object.keys(levelResult.originalData[argDataKey]).length > 0){
					this._renderLevel(argDataKey,i,levelResult.originalData[argDataKey]);	
				}else{
					finalLevel = true;
				}
			}
			this.targetData.finalLevel = finalLevel;
			this.trigger('change',this.targetData);
		},
		
		tpl : ['<div class="<%= classPrefix %>-wrapper">',
				'</div>'].join(''),
		end: 0	
	});
	
	return Geoinfo;
});