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
   
    //��֧��websocket
    if ( !websocketFlag ) {

        WebSocket = Class( Base, {

            /**
             * ��ʼ��
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
             * �¼�����
             */
            _buildEvent: function(config){

                var flash = this.engine;

                flash.on('swfReady', function(){

                    flash.open( config );
                    
                    //ִ��ready֮����
                    for (var i = 0, l = funcCaches.length; i < l; i++) {

                        funcCaches[i]();

                    }
                    
                });

                //��~
                flash.on('open', function(){

                   lofty.log('[websocket] socket is opened...');

                   $.isFunction( config.onopen ) && config.onopen();

                });
                //���� ~
                flash.on('send', function(){
                
                    $.isFunction( config.onsend ) && config.onsend();
                    
                });
                //������Ϣ~
                flash.on('message', function( data ){

                   lofty.log('[websocket] socket is received msg ...' );

                   $.isFunction( config.onmessage ) && config.onmessage(data);
                    
                });
                //�ر����� ~
                flash.on('close', function(){
                    
                   lofty.log('[websocket] socket is closed...');
                
                   $.isFunction( config.onclose ) && config.onclose();
                    
                });
                //״̬�޸� ~
                flash.on('stateChange', function(){

                    /*self.engine.readyState = self.engine.getReadyState();*/
                    flash.readyState = flash.getReadyState();

                    lofty.log('[websocket] state change, state :'  + flash.readyState);
                    
                });
                
            },
            /**
             * ������
             */
            open: function( config ){

                if (this.engine) { 

                    this.engine.open( config );

                }
            },

            /**
             * �ر�����
             */
            close: function( config ){

                if (this.engine) { 

                    this.engine.close( config );

                }
            },
            /**
             * ��������
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
             * ��ʼ��
             */
            init: function(config){

                this.config = config;

                this.engine = new window.WebSocket(config.url);

                $.extend(this.engine, config);

            },

            /**
             * ������
             */
            open: function(){

                this.engine = new window.WebSocket(this.config.url)

            },

            /**
             * ��������
             */
            send: function(data){

                this.engine.send(data);

            },

            /**
             * �ر�����
             */
            close: function(){

                this.engine.close();

            },
            /**
             * ������Ϣ
             */
            message: function(){
            
            }

        });

        
    };

    /**
     * ����flashready�¼�
     */
    WebSocket.ready = function ( callback ){
         
        if ( !websocketFlag ) {
           
            funcCaches.push( callback );

            return;

        }
        //����ִ��
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

    //��������
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
