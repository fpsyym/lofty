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
					description: "ͼƬ(*.jpg, *.jpeg, *.gif, *.png, *.bmp)",
					extensions: "*.jpg;*.jpeg;*.gif;*.png;*.bmp;"
				}],
				identity:"fname",//���й�վʹ��ʱ��ʹ��'fname'
				flashvars: {
					//enabled: false,
					//Ϊ�˷�ֹIE�¿������⣬ͳһ����Ϊ500
					startDelay: 500,
					// ��ťƤ������Ҫ���������ṩ��normal����hover����active����disabled������״̬ͼ���Ҹ߶�һ��
					buttonSkin: 'http://img.china.alibaba.com/cms/upload/2011/040/820/28040_548721671.gif',
				}
			},
			_beforeCreate:function(){
				if (!Flash.util.hasVersion(10)){
					//��û��flash��汾��������ʾ����flash
					flashDownLoadTip.call(this);
					//���
					if (typeof window.dmtrack != "undefined") {
						dmtrack.clickstat('http://stat.1688.com/tracelog/click.html', '?tracelog=ibank_noflash');
					}
					//����Ҫflash����ṩ��������flash�Ĳ��� return false;
					return false;
				}
				//�����ϴ�����
				var self = this;
				if (this.get('fileFilters')) {
					this.on('swfReady', function(e, data){
						self.obj.setBrowseFilter(this.get('fileFilters'));
					});
				}
			},
			
			/**
			 * ����Flash�����ò���
			 */
			_getFlashConfigs: function(){
				var configs = Flash.prototype._getFlashConfigs.call(this);
				return configs;
			},
			/**
			 * �ϴ�
			 * @param {Object} url
			 * @param {Object} param
			 */
			uploadAll: function(url, param, fileFieldName, identity){
				url += ((url.indexOf('?') < 0) ? '?' : '&') + '_input_charset=UTF-8';
				this.obj.uploadAll(url, param, fileFieldName, identity || this._getFlashConfigs().identity);
				return this;
			},
			/**
			 * ��ȡ��Ӧ�ļ�id���ļ���Ϣ
			 * @param {Object} id
			 */
			getFileStatus: function(id){
				return this.obj.getFileStatus(id);
			},
			/**
			 * ��ȡ�����ļ�����Ϣ
			 */
			getFileStatuses: function(){
				return this.obj.getFileStatuses();
			},
			/**
			 * �����ļ���������
			 * @param {Array} filter ����Ԫ�ظ�ʽ���£�
			 *  {
			 *      //description���û��ܿ���������
			 *      description: 'ͼƬ�ļ� (jpg,jpeg,gif)',
			 *      //extensions ���Էֺŷָ��ĺ�׺�б�
			 *      extensions: '*.jpg; *.jpeg; *.gif;'
			 *  }
			 */
			setBrowseFilter: function(filter){
				this.obj.setBrowseFilter(filter);
				return this;
			},
			/**
			 * ��̬�޸�ÿ���ϴ���������
			 * @param {Int} n
			 */
			setFileCountLimit: function(n){
				this.obj.setFileCountLimit(n);
				return this;
			},
			/**
			 * ��յ�ǰ�ϴ����ļ�״̬�б�
			 */
			clear: function(){
				this.obj.clear();
				return this;
			},
			/**
			 * ���ʧЧ
			 */
			disable: function(){
				try { this.obj.disable(); } catch (e) {}
				this.set("disabled",true);
				var container = this.get('container');
				container.addClass("ui-flash-disabled ui-state-disabled").attr("aria-disabled", true);
				return this;
			},
			/**
			 * �����Ч
			 */
			enable: function(){
				try { this.obj.enable(); } catch(e) {}
				this.set("disabled",false);
				var container = this.get('container');
				container.removeClass("ui-flash-disabled ui-state-disabled").attr("aria-disabled", false);
				return this;
			},
			/**
			 * ����Ƿ���Ч
			 */
			isEnabled: function(){
				return this.obj.isEnabled();               
			},
			/**
			 * �����û�һ��ѡ�����ļ�
			 */
			enableMultiple: function(){
				this.obj.enableMultiple();
				return this;               
			},
			/**
			 * ��������������û�һ��ֻ��ѡ��1���ļ�
			 */
			disableMultiple: function(){
				this.obj.disableMultiple();
				return this;               
			},
			/**
			 * ���ص�ǰ�û�Ŀǰ�Ƿ����ѡ�����ļ�
			 */
			isMultiple: function(){
				return this.obj.isMultiple();   
			}
		});
		
		function flashDownLoadTip(){
			var container = this.get('container');
			container.html('<a href="http://www.adobe.com/go/getflashplayer" target="_blank">��Ǹ����δ��װflash���޷�ʹ���ϴ����ܣ���������flash��</a>');
			//��������
			var con = $('>a', container).css({
				position:'static'
			});
		}
		return FlashUploader;
	}
);
