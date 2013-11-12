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

                //����ű�
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
             * ����Flash�����ò���
             */
            _getFlashConfigs: function(){

                var self = this, configs;

                //����ԭʼ����
                configs = Flash.prototype._getFlashConfigs.call(self);

                return configs;

            },
            /**
             * ������Ϣ
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
             * �򿪳�����
             * @param {Object} config
             */
            open: function(config){

                try {
                    //��ȫУ�飬��ֹ������������ʼ��flash��λ���뷢����Ϣ��λ�ò�һ�µ�
                    this.obj.setCallerUrl(location.href);

                    this.obj.create(config.url, config.protocal);

                } 
                catch (e) {
                    //$.log('setCallerUrl or create websocket error is ' + e.message);
                }
            },
            /**
             * �رճ�����
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

