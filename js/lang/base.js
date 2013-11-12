/*!!cmd:compress=true*/
/*!!cmd:jsCompressOpt=["--disable-optimizations"]*/

/**
 * @module lofty/lang/base
 * @author terence.wangt
 * @date 20130630
 * */

define( 'lofty/lang/base', ['lofty/lang/class', 
							'lofty/lang/attribute',
							'lofty/lang/observer',
							'lofty/lang/pluginhost'],
	function(Class, Attribute, observer, PluginHost){
	'use strict';
	
	var Base = Class.extend( Class(), [ Attribute, PluginHost], {
		
		init:function(config) {
			
			this.initOptions(config);
			
			if(config && config.plugins){
				this.install(config.plugins);
			}
		},
		
		destory:function() {
				
			this.uninstall();
			
			this.off();
			
			for (var key in this) {
				if (this.hasOwnProperty(key)) {
					delete this[key];
				}
			}
		}
	});

	/**
	* �̳�observer��������෽�����������Զ���Event��֧��
	*/

	observer.mixin(Base.prototype);
	
	return Base;
	
} );
