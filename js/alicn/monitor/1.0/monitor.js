/*!!cmd:compress=true*/
/*!!cmd:jsCompressOpt=["--disable-optimizations"]*/

/**
 * @module lofty/alicn/monitor
 * @author Edgar
 * @date 130708
 * */
 
define( 'lofty/alicn/monitor/1.0/monitor', function(){
    
    'use strict';
    
    var ua = window.navigator.userAgent.toLowerCase(),
        rChrome = /(chrome)[\/]([\w.]+)/,
        rWebkit = /(webkit)[ \/]([\w.]+)/,
        rOpera = /(opera)(?:.*version)?[ \/]([\w.]+)/,
        rMsie = /(msie) ([\w.]+)/,
        rMozilla = /(mozilla)(?:.*? rv:([\w.]+))?/,
        getBrowser = function(){
            var match = rChrome.exec( ua ) ||
                        rWebkit.exec( ua ) ||
                        rOpera.exec( ua ) ||
                        rMsie.exec( ua ) ||
                        ua.indexOf('compatible') < 0 && rmozilla.exec( ua ) ||
                        ['unkown','0'];
            return {
                name: match[1],
                version: match[2]
            }
        };
    
    
    var LOG_SERVER = 'http://110.75.196.102/page/logError';
    
    var i = 0,
        configFlag = false,
        defaultConfig = {
            //'appkey', 'browser', 'erroruri', 'module', 'level', 'msg'
        },
        setDefaultConfig = function(){
            
            var browser = getBrowser();
            defaultConfig.browser = encodeURIComponent( browser.name + ' ' + browser.version );
            defaultConfig.erroruri = encodeURIComponent( window.location.href );
            defaultConfig.level = 3;
            
            configFlag = true;
        },
        getRnd = function(){
            var t = ( new Date() ).getTime() + '' + i;
            i++;
            
            return t;
        },
        getParams = function( options ){
            var temp = {}, params = [];
            
            for ( var key in defaultConfig ){
                temp[key] = defaultConfig[key];
            }
            
            for ( var key in options ){
                temp[key] = encodeURIComponent( options[key] );
            }
            
            for ( var key in temp ){
                params.push( key + '=' + temp[key] );
            }
            
            return params.join('&');
        };
    
    
    var rNative = /\{\s*\[(?:native code|function)\]\s*\}/i,
        isNative = function( fn ){
            if ( 'function' === typeof fn && !rNative.test( fn ) ){
                for ( var i in fn ){
                    return false;
                }
                
                return true;
            }
            
            return false;
        },
        inject = function( moduleId, host, methodName, options ){
            
            var joinPoint = host[methodName],
                before, afterThrow, after;
            
            host[methodName] = function(){
                var returnValue,
                    ware = {
                        id: moduleId,
                        method: methodName
                    };
                
                ( before = options.before ) && before( ware );
                
                try {
                    returnValue = joinPoint.apply( this, arguments );
                } catch ( ex ){
                    ( afterThrow = options.afterThrow ) && afterThrow( ware, ex );
                }
                
                ( after = options.after ) && after( ware );
                
                return returnValue;
            };
        },
        filterStack = ['jQuery','FE'],
        filter = function( it ){
            for ( var i = 0, l = filterStack.length; i < l; i++ ){
                if ( it === window[filterStack[i]] ){
                    return true;
                }
            }
            return false;
        };
    
    
    var monitor = {
        updateConfig: function( options ){
            for ( var key in options ){
                defaultConfig[key] = encodeURIComponent( options[key] );
            }
        },
        log: function( options ){
            /**
             * Thanks to:
             * http://oldj.net/article/one-thing-to-notice-about-new-image
             * */
            var t = getRnd(),
                rnd = '__lofty_monitor_img_' + t,
                img = new Image();
                
            configFlag || setDefaultConfig();
            
            window[rnd] = img;
            
            img.onload = img.onerror = function(){
                window[rnd] = null;
            
            };
            
            img.src = LOG_SERVER + '?' + getParams( options ) + '&rnd=' + t;
        },
        moduleMonitor: function(){
            var _this = this;
            
            lofty.config({
                hasCatch: true
            });
            
            lofty.on( 'compileFail', function( ex, mod ){
                _this.log( { module: mod.id || mod._id, msg: ex.message } );
            } );
            
            lofty.on( 'requireFail', function( meta ){
                _this.log( { module: meta.id, msg: 'does not exist' } );
            } );
            
            lofty.on( 'requestTimeout', function( asset ){
                _this.log( { module: asset.id, msg: 'request timeout' } );
            } );
        },
        add: function( moduleId, host, options ){
            
            options = options || {};
            
            for ( var name in host ){
                if ( isNative( host[name] ) ){
                    inject( moduleId, host, name, options );
                }
            }
        },
        methodMonitorOptions: {
            afterThrow: function( ware, ex ){
                monitor.log( { module: ( ware.id || '' ) + '#' + ware.method, msg: ex.message } );
            }
        },
        methodMonitor: function(){
            var _this = this;
            
            lofty.on( 'compiled', function( mod ){
                mod.id && mod.exports && !filter( mod.exports ) && _this.add( mod.id, mod.exports, _this.methodMonitorOptions );
            } );
        }
    };
    
    
    return monitor;
    
} );
