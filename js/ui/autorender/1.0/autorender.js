/*!!cmd:compress=true*/
/*!!cmd:jsCompressOpt=["--disable-optimizations"]*/

/**
 * @module lofty/ui/autorender
 * @from modify from butterfly
 * @author terence.wangt
 * @date 20130701
 * */

define( 'lofty/ui/autorender/1.0/autorender', ['require', 'lofty/lang/class', 'jquery'], function(require, Class, $) {
    'use strict';

	var AutoRender = Class({
		
		init: function(root) {

			root = $(root || document.body)
			
			var self = this,
				elms = $('[data-fui-widget]', root); 
			elms.length && elms.each(function() {
				self.handle($(this));
			});
		},

		handle: function(elm) {
			var self = this,
				type = elm.data('fui-widget'),
				config = elm.data('fui-config') || {};

			if ($.isArray(type)) {
				$.each(type, function(index, item) {
					self.process(item, config[index] || {}, elm);
				});
			} else {
				self.process(type, config, elm);
			}
		},

		process: function(type, config, elm) {
			if (config.__AutoRenderd) {
				return;
			}
			config.__AutoRenderd =  true;

			require.use([type], function(o) {
				try {
					var cfg = $.extend(true, {
						container: elm,
						el: elm
					}, config);
							
					if (typeof o === 'function') {
						new o(cfg).render();
					} else if (o && o.init) {
						o.init(cfg).render();
					}
				} catch (e) {
					//log.error(e);
				}
			});
		}
		
	});
	
	AutoRender.render = function( root ){
		new AutoRender(root);
	};
	
	return AutoRender;
	
});
