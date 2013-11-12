/*!!cmd:compress=true*/
/*!!cmd:jsCompressOpt=["--disable-optimizations"]*/

/**
 * @module fdui/ui/flashchart
 * @from 
 * @author chuanpeng.qchp
 * @date 20130909
 * */

define( 'lofty/ui/flashchart/1.0/flashchart', ['lofty/lang/class', 'lofty/ui/flash/1.0/flash','lofty/util/misc/1.0/misc'], 
	function( Class, Flash,Util){
		'use strict';
		var FlashChart = Class( Flash, {
			options:{
				width: 700,
                height: 400,
                swf: "",
                //允许脚本
                allowScriptAccess: 'always',
                flashvars: {
                    startDelay: 500
                }
			},
			_beforeCreate:function(){
				if (!Flash.util.hasVersion(10)){
					return false;
				}
				var type = this.get('type');
				if(!type) {
					return false;
				}
				var swf = Util.substitute('http://view.1688.com/book/swfapp/chart/beechart-{0}.swf', [type]);
				this.set('swf',swf);
			},
			
			/**
			 * 配置Chart的配置参数
			 */
			_getFlashConfigs: function(){
				var configs = Flash.prototype._getFlashConfigs.call(this);
				//这里去掉多余的参数
				delete configs.type;
				return configs;
			},
			/**
			 * 载入XML数据文件
			 * @param {string} xmlurl xml数据文件的URL
			 * @return {boolean} 成功返回true，否则返回false
			 */
			load: function(dataurl, charset){
				charset = charset || 'utf-8';
				return this.obj.load(dataurl, charset);
			},
			/**
			 * 载入CSS文件
			 * @param {string} cssurl css文件的URL
			 * @return {boolean} 成功返回true，否则返回false
			 */
			loadCSS: function(cssurl, charset){//载入CSS文件
				charset = charset || 'utf-8';
				return this.obj.loadCSS(cssurl, charset);
			},
			/**
			 * 载入XML字符串
			 * @param {string} xmlString xml字符串
			 * @return {boolean} 成功返回true，否则返回false
			 */
			parse: function(xmlString){
				return this.obj.parse(xmlString);
			},
			/**
			 * 载入CSS字符串
			 * @param {string} cssString css字符串
			 * @return {boolean} 成功返回true，否则返回false
			 */
			parseCSS: function(cssString){
				return this.obj.parseCSS(cssString);
			},
			/**
			 * 设置某条数据可见性
			 * @param {int} index 数据索引
			 * @param {boolean} active 可见性true|false
			 * @return {boolean} 成功返回true，否则返回false
			 */
			setDatasetVisibility: function(index, active){
				return this.obj.setDatasetVisibility(index, active);
			},
			/**
			 * 获得某条数据的可见性
			 * @param {int} index 数据索引
			 * @return {boolean} 可见返回true，不可见返回false
			 */
			getDatasetVisibility: function(index){
				return this.obj.getDatasetVisibility(index);
			},
			/**
			 * 设置某条数据的激活状态
			 * @param {int} index 数据索引
			 * @param {boolean} active 是否激活true|false
			 * @return {boolean} 成功返回true，否则返回false
			 */
			setDatasetActivity: function(index, active){
				return this.obj.setDatasetActivity(index, active);
			},
			/**
			 * 获得某条数据的激活状态
			 * @param {int} index 数据索引
			 * @return {boolean} 激活返回true，未激活返回false
			 */
			getDatasetActivity: function(index){
				return this.obj.getDatasetActivity(index);
			}
		});
		return FlashChart;
	}
);
