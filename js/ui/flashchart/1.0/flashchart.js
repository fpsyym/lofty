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
                //����ű�
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
			 * ����Chart�����ò���
			 */
			_getFlashConfigs: function(){
				var configs = Flash.prototype._getFlashConfigs.call(this);
				//����ȥ������Ĳ���
				delete configs.type;
				return configs;
			},
			/**
			 * ����XML�����ļ�
			 * @param {string} xmlurl xml�����ļ���URL
			 * @return {boolean} �ɹ�����true�����򷵻�false
			 */
			load: function(dataurl, charset){
				charset = charset || 'utf-8';
				return this.obj.load(dataurl, charset);
			},
			/**
			 * ����CSS�ļ�
			 * @param {string} cssurl css�ļ���URL
			 * @return {boolean} �ɹ�����true�����򷵻�false
			 */
			loadCSS: function(cssurl, charset){//����CSS�ļ�
				charset = charset || 'utf-8';
				return this.obj.loadCSS(cssurl, charset);
			},
			/**
			 * ����XML�ַ���
			 * @param {string} xmlString xml�ַ���
			 * @return {boolean} �ɹ�����true�����򷵻�false
			 */
			parse: function(xmlString){
				return this.obj.parse(xmlString);
			},
			/**
			 * ����CSS�ַ���
			 * @param {string} cssString css�ַ���
			 * @return {boolean} �ɹ�����true�����򷵻�false
			 */
			parseCSS: function(cssString){
				return this.obj.parseCSS(cssString);
			},
			/**
			 * ����ĳ�����ݿɼ���
			 * @param {int} index ��������
			 * @param {boolean} active �ɼ���true|false
			 * @return {boolean} �ɹ�����true�����򷵻�false
			 */
			setDatasetVisibility: function(index, active){
				return this.obj.setDatasetVisibility(index, active);
			},
			/**
			 * ���ĳ�����ݵĿɼ���
			 * @param {int} index ��������
			 * @return {boolean} �ɼ�����true�����ɼ�����false
			 */
			getDatasetVisibility: function(index){
				return this.obj.getDatasetVisibility(index);
			},
			/**
			 * ����ĳ�����ݵļ���״̬
			 * @param {int} index ��������
			 * @param {boolean} active �Ƿ񼤻�true|false
			 * @return {boolean} �ɹ�����true�����򷵻�false
			 */
			setDatasetActivity: function(index, active){
				return this.obj.setDatasetActivity(index, active);
			},
			/**
			 * ���ĳ�����ݵļ���״̬
			 * @param {int} index ��������
			 * @return {boolean} �����true��δ�����false
			 */
			getDatasetActivity: function(index){
				return this.obj.getDatasetActivity(index);
			}
		});
		return FlashChart;
	}
);
