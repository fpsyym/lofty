/*!!cmd:compress=true*/
/*!!cmd:jsCompressOpt=["--disable-optimizations"]*/

/**
 * @author xianxia.jinaxx
 * @file websocket
 * @date 2013-08-20
 * jQuery, lofty/ui/flash/flash
 */

define('lofty/util/websocket/1.0/flashWebsocket',  ['lofty/lang/class', 'lofty/ui/flash/1.0/flash'],
        
    function ( Class, Flash ){

    'use strict';

    var FlashWebsocket = Class( Flash, {

            options : {
                      
                swf: 'http://img.china.alibaba.com/swfapp/websocket/websocket-20111121.swf',

                //允许脚本
                allowScriptAccess: 'always',

                flashvars: {

                    debug : false

                }
                      
            },

            _beforeCreate:function(){

				if (!Flash.util.hasVersion( 9 )){
					return false;
				}


            },

            /**
             * 配置Flash的配置参数
             */
            _getFlashConfigs: function(){

                var self = this, configs;

                //调用原始方法
                configs = Flash.prototype._getFlashConfigs.call(self);

                return configs;

            },
            /**
             * 发送消息
             * @param {Object} data
             */
            send: function(data){

                if (this.readyState === 2) {

                    return;

                }

                try {

                    /*this.obj.send(data);*/
                    this.callMethod('send',data);

                }catch (e) {
                    //$.log('send msg is error ' + e.message);
                }

            },
            /**
             * 打开长连接
             * @param {Object} config
             */
            open: function(config){

                try {
                    //安全校验，防止攻击，谨防初始化flash的位置与发出信息的位置不一致的
                    this.obj.setCallerUrl(location.href);

                    this.obj.create(config.url, config.protocal);

                } 
                catch (e) {
                    //$.log('setCallerUrl or create websocket error is ' + e.message);
                }
            },
            /**
             * 关闭长连接
             */
            close: function(){

                this.obj.close();

            },

            getReadyState:function(){

                return this.obj.getReadyState();

            }


        });

    return FlashWebsocket;

});

