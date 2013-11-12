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
                //����ű�
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
				//���趨��width��height��ֵ��flashvars
				this.get('flashvars').width = this.get('width');
				this.get('flashvars').height = this.get('height');
			},
			
			/**
			 * ����flash�����ò���
			 */
			_getFlashConfigs: function(){
				var configs = Flash.prototype._getFlashConfigs.call(this);
				return configs;
			},
			/**
			 * ������Ҫ���Ƶ���������ı�
			 * @param {string} text ��Ҫ���Ƽ�������ı�
			 */
			setText: function(text){
				this.obj.setText(text);
			},
			/**
			 * �����ƶ���flash��ʱ���Ƿ�ʹ����Ϊ����
			 * @param {boolean} enabled �Ƿ�ʹ������Ϊ����
			 */
			setHandCursor: function(enabled){
				this.obj.setHandCursor(enabled);
			}
		});
		return FlashClipboard;
	}
);
