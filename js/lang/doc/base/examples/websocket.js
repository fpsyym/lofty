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
		
		//如果Util类功能不复杂，不使用Attribute或Event或Plug功能，只是简单提供方法，
		//可以不继承Base类, 直接：var WebSocket = Class({ ... });
		var WebSocket = Class( Base, {
		
			/**
			 * 属性的默认配置
			 */
			options: {
				myOptions: true                // 组件的某个属性
			},
			
			/**
			 * 入口函数
			 */
			init:function(config){
				
				// 若继承自Base类，则需要显式调用基类构造函数
				// 若没有继承自Base类，则不必调用该函数
				Base.prototype.init.apply(this, arguments);
			},
			
			end:0								//end只是结束符，无意义，防止少些逗号
		});
		
		
		////////////////////////////////////////////////////////////////////////////////////////////
		// 私有方法定义区
		// 下面定义的是一些组件的私有方法 （不希望暴露接口给外部，也不允许外部通过AOP的方式重写）
		
		/**
		 * @useage  如果组件的公用方法调用这些私有方法，若私有方法中无需this对象，则直接调用：privateFunc();
		 * @useage  如果组件的公用方法调用这些私有方法，若私有方法需要使用this对象，则调用：privateFunc.call(this);
		 */
		function privateFunc() {
			return;
		}
	
		return WebSocket;
});
