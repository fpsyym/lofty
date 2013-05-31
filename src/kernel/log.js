/**
 * @module lofty/kernel/log
 * @author Edgar <mail@edgarhoo.net>
 * @version v0.1
 * @date 130531
 * */


lofty( 'log', ['global','console','request','require'],
    function( global, console, request, require ){
    'use strict';
    
    var _this = this;
    
    var noop = _this.log = function(){},
        sysConsole = global.console;
    
    var log = {
        create: function( isDebug ){
            _this.log = isDebug ? ( sysConsole && sysConsole.warn ? function( message, level ){
                sysConsole[ level || 'log' ]( message );
            } : function( message, level ){
                if ( console ){
                    console( message, level );
                } else if ( request ) {
                    request( 'lofty/kernel/console', function(){
                        console || ( console = require('console') );
                        console( message, level );
                    } );
                }
            } ) : noop;
        },
        log: function( message ){
            _this.log( message, 'log' );
        },
        warn: function( message ){
            _this.log( message, 'warn' );
        }
    };
    
    return log;
    
} );
