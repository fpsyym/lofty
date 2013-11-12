/*!!cmd:compress=true*/
/*!!cmd:jsCompressOpt=["--disable-optimizations"]*/

/**
 * @module lofty/ui/template/tplhandler
 * @author chuanpeng.qchp
 * @date 20130806
 * ��������ui����е�ģ�壬�˷�������ͨ�õķ���
 */

define('lofty/util/template/1.0/tplhandler',['lofty/util/template/1.0/template', 'jquery'],function(Template, $){
	var tplHandler = {
		process:function(tplData){
			//�û��Զ����ģ�����
			var extendTplData = this.get('extendTplData');	
			
			if(!extendTplData && !tplData){
				return;
			}
			var data = $.extend(true, {}, tplData, extendTplData);
			var tplStr = this.get('tpl');
			var render = Template.compile(tplStr);
			var html = render(data);
			this.set('tpl',html);
			
		}
	};
	
	return tplHandler;
});