/*!!cmd:compress=true*/
/*!!cmd:jsCompressOpt=["--disable-optimizations"]*/

/**
 * @module fdui/ui/flashclipboard
 * @from 
 * @author chuanpeng.qchp
 * @date 20130909
 * */

define( 'lofty/ui/flashclipboard/1.0/flashclipboard', ['lofty/lang/class', 'lofty/ui/flash/1.0/flash'], 
	function( Class, Flash){
		'use strict';
		var FlashClipboard = Class( Flash, {
			options:{
				width: 30,
                height: 18,
                swf: 'http://view.1688.com/book/swfapp/clipboard/flashclipboard-v1.1.swf',
                //允许脚本
                allowScriptAccess: 'always',
                wmode: 'transparent',
                flashvars: {
                	startDelay: 500
                }
			},
			_beforeCreate:function(){
				if (!Flash.util.hasVersion(10)){
					return false;
				}
				//将设定的width、height赋值给flashvars
				this.get('flashvars').width = this.get('width');
				this.get('flashvars').height = this.get('height');
			},
			
			/**
			 * 配置flash的配置参数
			 */
			_getFlashConfigs: function(){
				var configs = Flash.prototype._getFlashConfigs.call(this);
				return configs;
			},
			/**
			 * 设置需要复制到剪贴板的文本
			 * @param {string} text 需要复制剪贴板的文本
			 */
			setText: function(text){
				this.obj.setText(text);
			},
			/**
			 * 设置移动到flash上时，是否使鼠标变为手型
			 * @param {boolean} enabled 是否使得鼠标变为手型
			 */
			setHandCursor: function(enabled){
				this.obj.setHandCursor(enabled);
			}
		});
		return FlashClipboard;
	}
);
