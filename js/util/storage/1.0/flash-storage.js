/*!!cmd:compress=true*/
/*!!cmd:jsCompressOpt=["--disable-optimizations"]*/

/**
 * SWFStore fdev-5 version
 * @author xianxia.jianxx 
 * Dependence:
 * jQuery, lofty/ui/flash/flash
 */

define('lofty/util/storage/1.0/flashStorage',[ 'lofty/lang/class', 'lofty/ui/flash/1.0/flash' ], 
       
    function ( Class , Flash ) {

    'use strict';

    var FlashStorage = Class( Flash, {
        
            options : {

                width: 1,

                height: 1,

                swf: 'http://img.china.alibaba.com/swfapp/swfstore/swfstore.swf',

                //����ű�
                allowScriptAccess: 'always',

                flashvars: {

                    startDelay: 500,

                    local_path: '/',

                    allowedDomain: location.hostname

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
            
            setItem: function(key, value){

                return this.callMethod('setItem',key,value);

            },

            getItem: function(key){

                return this.callMethod('getValueOf',key);

            },

            removeItem: function(key){

                return this.callMethod('removeItem',key);

            },

            clear: function(){

                return this.callMethod('clear');

            },

            getLength: function(){

                return this.callMethod('getLength');

            },

            key: function(n){

                return this.callMethod('getNameAt',n);

            }

        });

    return FlashStorage;

});
