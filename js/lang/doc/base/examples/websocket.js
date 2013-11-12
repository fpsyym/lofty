/**
 * @module lofty/ui/tabs/tabs
 * @author 
 * @date 20130630
 * 
 */

/*!!cmd:compress=true*/
/*!!cmd:jsCompressOpt=["--disable-optimizations"]*/
 
define('lofty/util/webSocket', ['lofty/lang/class', 'lofty/lang/base', 'jquery'], 

	function( Class, Base, $){
		
		//���Util�๦�ܲ����ӣ���ʹ��Attribute��Event��Plug���ܣ�ֻ�Ǽ��ṩ������
		//���Բ��̳�Base��, ֱ�ӣ�var WebSocket = Class({ ... });
		var WebSocket = Class( Base, {
		
			/**
			 * ���Ե�Ĭ������
			 */
			options: {
				myOptions: true                // �����ĳ������
			},
			
			/**
			 * ��ں���
			 */
			init:function(config){
				
				// ���̳���Base�࣬����Ҫ��ʽ���û��๹�캯��
				// ��û�м̳���Base�࣬�򲻱ص��øú���
				Base.prototype.init.apply(this, arguments);
			},
			
			end:0								//endֻ�ǽ������������壬��ֹ��Щ����
		});
		
		
		////////////////////////////////////////////////////////////////////////////////////////////
		// ˽�з���������
		// ���涨�����һЩ�����˽�з��� ����ϣ����¶�ӿڸ��ⲿ��Ҳ�������ⲿͨ��AOP�ķ�ʽ��д��
		
		/**
		 * @useage  �������Ĺ��÷���������Щ˽�з�������˽�з���������this������ֱ�ӵ��ã�privateFunc();
		 * @useage  �������Ĺ��÷���������Щ˽�з�������˽�з�����Ҫʹ��this��������ã�privateFunc.call(this);
		 */
		function privateFunc() {
			return;
		}
	
		return WebSocket;
});
