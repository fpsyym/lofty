/**
*	ҳ���Ψһ���ģ�飬���������ĳ�ʼ������
*/

lofty.config({
	amd: true
});	

// ������ģ���id���뵽������ϵ�б��У����������ø�ģ���init����������ʼ��
define(['lofty/lang/doc/context/simple/hotsale',
		'lofty/lang/doc/context/simple/page',
		'lofty/lang/doc/context/simple/combox', 
		'jquery'],

	function(SaleModule, PageModule, GeoModule, $){
	
		$(document).ready( function(){
			SaleModule.init();
			PageModule.init();
			GeoModule.init();
		});
});