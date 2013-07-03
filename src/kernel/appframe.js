/**
 * @module lofty/kernel/appframe
 * @author Edgar <mail@edgarhoo.net>
 * @version v0.1
 * @date 130703
 * */


lofty( 'appframe', ['global','config'],
    function( global, config ){
    'use strict';
    
    var _this = this;
    
    _this.appframe = function( name ){
        
        var frame = global[name] = {
            define: _this.define,
            log: function(){
                _this.log.apply( null, arguments );
            },
            config: _this.config,
            on: _this.on,
            off: _this.off
        },
        
        cfg = frame.config;
        
        cfg.addRule = config.addRule;
        cfg.addItem = config.addItem;
    };
    
} );
