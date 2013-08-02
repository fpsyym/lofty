/**
 * @module lofty/lang/base
 * @author terence.wangt
 * @date 20130630
 * */

define( 'lofty/lang/base', ['lofty/lang/class', 
							'lofty/lang/attribute',
							'lofty/lang/observer',
							'lofty/lang/pluginhost'],
	function(Class, Attribute, Observer, PluginHost){
	'use strict';
	
	var Base = Class.extend( Class(), [ Attribute, PluginHost], {
		
		init:function(config) {
			
			this.initOptions(config);
			
			if(config.plugins){
				this.install(config.plugins);
			}
			
			registerChangeEvent(this, this.options);
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
	
	
	function registerChangeEvent(host, options) {

		for (var key in options) {
			if (options.hasOwnProperty(key)) {
				
				var keyUp = key.charAt(0).toUpperCase() + 
					key.substring(1);
				
				var method = '_onChange' + keyUp;
				if (host[method]) {
					host.on(key + 'Change', host[method]);
				}
			}
		}
	}

	/**
	* 继承Observer类的所有类方法，增加了自定义Event的支持
	*/

	Observer.mixin(Base.prototype);
	
	return Base;
	
} );
