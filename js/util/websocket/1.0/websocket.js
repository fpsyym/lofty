/*!!cmd:compress=true*/
/*!!cmd:jsCompressOpt=["--disable-optimizations"]*/

/**
 * author xianxia.jianxx
 * date 2013-08-16
 * dependence: jQuery
 *
 *  WebSocket.ready(function(){
 * 		var myws = new WebSocket({
 *
 * 		    url:'ws://node.remysharp.com:8001'
 *          onopen : $.noop,
 *          onmessage : $.noop,
 *          onclose : $.noop
 * 	    });
 * });
 *
 */
 
define('lofty/util/websocket/1.0/websocket', ['jquery', 
											  'require', 
											  'lofty/util/misc/1.0/misc', 
											  'lofty/lang/class', 
											  'lofty/lang/base'],
											  
		function ( $, require, Util, Class, Base ){

		'use strict';

		var flashWebsocketId = 'flash-websocket-' + ($.guid++),

			websocketFlag =  Util.support.WebSocket,

			flashWebsocket = null,

        funcCaches = [],

        engine = null, WebSocket = {}; 
   
    //不支持websocket
    if ( !websocketFlag ) {

        WebSocket = Class( Base, {

            /**
             * 初始化
             */
            init: function(config){

                var self = this;

                if(!self.engine){

                    dependence(function (){

                       self.engine = buildSwf( );

                       self._buildEvent(config);

                    });

                } else {
                
                    self._buildEvent(config);
                
                }
            
            },
           
            /**
             * 事件处理
             */
            _buildEvent: function(config){

                var flash = this.engine;

                flash.on('swfReady', function(){

                    flash.open( config );
                    
                    //执行ready之后函数
                    for (var i = 0, l = funcCaches.length; i < l; i++) {

                        funcCaches[i]();

                    }
                    
                });

                //打开~
                flash.on('open', function(){

                   lofty.log('[websocket] socket is opened...');

                   $.isFunction( config.onopen ) && config.onopen();

                });
                //发送 ~
                flash.on('send', function(){
                
                    $.isFunction( config.onsend ) && config.onsend();
                    
                });
                //接收消息~
                flash.on('message', function( data ){

                   lofty.log('[websocket] socket is received msg ...' );

                   $.isFunction( config.onmessage ) && config.onmessage(data);
                    
                });
                //关闭连接 ~
                flash.on('close', function(){
                    
                   lofty.log('[websocket] socket is closed...');
                
                   $.isFunction( config.onclose ) && config.onclose();
                    
                });
                //状态修改 ~
                flash.on('stateChange', function(){

                    /*self.engine.readyState = self.engine.getReadyState();*/
                    flash.readyState = flash.getReadyState();

                    lofty.log('[websocket] state change, state :'  + flash.readyState);
                    
                });
                
            },
            /**
             * 打开连接
             */
            open: function( config ){

                if (this.engine) { 

                    this.engine.open( config );

                }
            },

            /**
             * 关闭连接
             */
            close: function( config ){

                if (this.engine) { 

                    this.engine.close( config );

                }
            },
            /**
             * 发送请求
             */
            send: function( data ){

                if (this.engine) { 

                    this.engine.send( data );

                }
            }
        });
        
    } else {

        WebSocket = Class(Base, {

            /**
             * 初始化
             */
            init: function(config){

                this.config = config;

                this.engine = new window.WebSocket(config.url);

                $.extend(this.engine, config);

            },

            /**
             * 打开连接
             */
            open: function(){

                this.engine = new window.WebSocket(this.config.url)

            },

            /**
             * 发送请求
             */
            send: function(data){

                this.engine.send(data);

            },

            /**
             * 关闭连接
             */
            close: function(){

                this.engine.close();

            },
            /**
             * 接收消息
             */
            message: function(){
            
            }

        });

        
    };

    /**
     * 兼容flashready事件
     */
    WebSocket.ready = function ( callback ){
         
        if ( !websocketFlag ) {
           
            funcCaches.push( callback );

            return;

        }
        //立即执行
        $.isFunction( callback ) && callback();
        
    }

    function buildSwf ( callback ){

            $('<div>', {

                id: flashWebsocketId

            }).css({

                'position': 'absolute',

                'left': '-1000px',

                'top': '-1000px'

            }).appendTo('body');

            var flashObj = new flashWebsocket({
            
                container : '#' + flashWebsocketId
            }); 

            return flashObj;

    }

    //加载依赖
    function dependence ( callback ){

        var de = [], fSocketStr, fStr;
       
        if ( !websocketFlag ) {

            fSocketStr = 'lofty/util/websocket/flashWebsocket';

            de.push( fSocketStr );

        }            

        require.use( de,function ( ){

            if( fSocketStr ){
                
                flashWebsocket = require( fSocketStr );

            }

            $.isFunction( callback ) && callback();

        });

    };




    return WebSocket;

});
