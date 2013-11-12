/*!!cmd:compress=true*/
/*!!cmd:jsCompressOpt=["--disable-optimizations"]*/

/**
 * @module fdui/ui/flashuploader
 * @from 
 * @author chuanpeng.qchp
 * @date 20130909
 * */

define( 'lofty/ui/flashuploader/1.0/flashuploader', ['lofty/lang/class', 'lofty/ui/flash/1.0/flash','jquery'], 
	function( Class, Flash, $){
		'use strict';
		var FlashUploader = Class( Flash, {
			options:{
				swf: 'http://view.1688.com/book/swfapp/aliuploader/aliuploader-v3.5.swf',
				width: 65,
				height: 22,
				allowscriptaccess: 'always',
				fileFilters: [{
					description: "图片(*.jpg, *.jpeg, *.gif, *.png, *.bmp)",
					extensions: "*.jpg;*.jpeg;*.gif;*.png;*.bmp;"
				}],
				identity:"fname",//在中国站使用时，使用'fname'
				flashvars: {
					//enabled: false,
					//为了防止IE下跨域问题，统一设置为500
					startDelay: 500,
					// 按钮皮肤，需要从上至下提供“normal”“hover”“active”“disabled”四种状态图，且高度一致
					buttonSkin: 'http://img.china.alibaba.com/cms/upload/2011/040/820/28040_548721671.gif',
				}
			},
			_beforeCreate:function(){
				if (!Flash.util.hasVersion(10)){
					//若没有flash或版本不够，提示下载flash
					flashDownLoadTip.call(this);
					//打点
					if (typeof window.dmtrack != "undefined") {
						dmtrack.clickstat('http://stat.1688.com/tracelog/click.html', '?tracelog=ibank_noflash');
					}
					//不需要flash组件提供后续插入flash的操作 return false;
					return false;
				}
				//设置上传类型
				var self = this;
				if (this.get('fileFilters')) {
					this.on('swfReady', function(e, data){
						self.obj.setBrowseFilter(this.get('fileFilters'));
					});
				}
			},
			
			/**
			 * 配置Flash的配置参数
			 */
			_getFlashConfigs: function(){
				var configs = Flash.prototype._getFlashConfigs.call(this);
				return configs;
			},
			/**
			 * 上传
			 * @param {Object} url
			 * @param {Object} param
			 */
			uploadAll: function(url, param, fileFieldName, identity){
				url += ((url.indexOf('?') < 0) ? '?' : '&') + '_input_charset=UTF-8';
				this.obj.uploadAll(url, param, fileFieldName, identity || this._getFlashConfigs().identity);
				return this;
			},
			/**
			 * 获取对应文件id的文件信息
			 * @param {Object} id
			 */
			getFileStatus: function(id){
				return this.obj.getFileStatus(id);
			},
			/**
			 * 获取所有文件的信息
			 */
			getFileStatuses: function(){
				return this.obj.getFileStatuses();
			},
			/**
			 * 设置文件过滤类型
			 * @param {Array} filter 数组元素格式如下：
			 *  {
			 *      //description是用户能看到的描述
			 *      description: '图片文件 (jpg,jpeg,gif)',
			 *      //extensions 是以分号分隔的后缀列表
			 *      extensions: '*.jpg; *.jpeg; *.gif;'
			 *  }
			 */
			setBrowseFilter: function(filter){
				this.obj.setBrowseFilter(filter);
				return this;
			},
			/**
			 * 动态修改每次上传个数限制
			 * @param {Int} n
			 */
			setFileCountLimit: function(n){
				this.obj.setFileCountLimit(n);
				return this;
			},
			/**
			 * 清空当前上传的文件状态列表
			 */
			clear: function(){
				this.obj.clear();
				return this;
			},
			/**
			 * 组件失效
			 */
			disable: function(){
				try { this.obj.disable(); } catch (e) {}
				this.set("disabled",true);
				var container = this.get('container');
				container.addClass("ui-flash-disabled ui-state-disabled").attr("aria-disabled", true);
				return this;
			},
			/**
			 * 组件有效
			 */
			enable: function(){
				try { this.obj.enable(); } catch(e) {}
				this.set("disabled",false);
				var container = this.get('container');
				container.removeClass("ui-flash-disabled ui-state-disabled").attr("aria-disabled", false);
				return this;
			},
			/**
			 * 组件是否有效
			 */
			isEnabled: function(){
				return this.obj.isEnabled();               
			},
			/**
			 * 允许用户一次选择多个文件
			 */
			enableMultiple: function(){
				this.obj.enableMultiple();
				return this;               
			},
			/**
			 * 调用这个方法后，用户一次只能选择1个文件
			 */
			disableMultiple: function(){
				this.obj.disableMultiple();
				return this;               
			},
			/**
			 * 返回当前用户目前是否可以选择多个文件
			 */
			isMultiple: function(){
				return this.obj.isMultiple();   
			}
		});
		
		function flashDownLoadTip(){
			var container = this.get('container');
			container.html('<a href="http://www.adobe.com/go/getflashplayer" target="_blank">抱歉，您未安装flash，无法使用上传功能，请先下载flash！</a>');
			//设置容器
			var con = $('>a', container).css({
				position:'static'
			});
		}
		return FlashUploader;
	}
);
