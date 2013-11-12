/**
*	页面的唯一入口模块，负责各区块的初始化工作
*/

lofty.config({
	amd: true
});	

// 将各个模块的id引入到依赖关系列表中，并主动调用各模块的init函数来做初始化
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