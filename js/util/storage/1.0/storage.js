/*!!cmd:compress=true*/
/*!!cmd:jsCompressOpt=["--disable-optimizations"]*/

/**
 * author xianxia.jianxx
 * date 2013-08-16
 * dependence: jQuery
 */

define('lofty/util/storage/1.0/storage',['jquery', 'require', 'lofty/util/misc/1.0/misc' ],function ( $, require, Util ){

    'use strict';

    var WIN = window,

        _funcsCache = [],

        Engine = null,

        JSON = WIN.JSON,

        flashStorage,

        flashStorageId = 'swf-storage-' + ( $.guid++ ),

        FlashEngineName = 'swfStoreTemp',

        initStat = false; // calc dependence 

    var Storage = {

        init : function (){

            var self = this, flash = null;

            if ( initStat ) {

                return ;

            }
            dependence(function (){

                if (Engine === FlashEngineName) {

                    $(function(){ //确保 DOMReady

                       flash = Engine =  _initSwfStore();

                        flash.on('contentReady', function(){

                            _completeInit();

                        });

                        flash.on( 'error', function(ev, o){

                            Storage.trigger('error', o);

                        });

                        flash.on( 'securityError', function(ev, o){

                            Storage.trigger( 'securityError', o );

                        });

                    });

                } else {

                    Engine = WIN.localStorage;

                    _completeInit();

                }

            });

        },
         /**
         * store string to localStorage
         */
        setItem: function(key, value){

            try {

                var result = Engine.setItem(key, value);

            } catch (ex) {

                this.trigger( 'error', {

                    exception: ex

                });

            }
            return result;

        },
        
        /**
         * get string from localStorage
         */
        getItem: function(key){
            return Engine.getItem(key);
        },
        
        /**
         * set json to localStorage
         */
        setJson: function(key, value){
            return Engine.setItem(key, encodeURIComponent(JSON.stringify(value)));
        },
         /**
         * get json from localStorage
         */
        getJson: function(key){
            return JSON.parse(decodeURIComponent(this.getItem(key)));

        },
        
        /**
         * remove item from localStorage
         */
        removeItem: function(key){
            return Engine.removeItem(key);
        },
            
        /**
         * clear all data in localStorage
         */
        clear: function(){
            return Engine.clear();
        },
         /** 
         * return the number of key/value pairs  current in localStorage
         */
        getLength: function(){

            return Util.support.localStorage ? Engine.length : Engine.getLength();

        },
        
        /**
         * return the name of nth key in the list
         */
        key: function(n){
            return Engine.key(n);
        },
        
        /** 
         * because of the fallback of flash(asyn mode) , all the operation must be wraped by this ready function
         */
        ready: function(func){

            if (initStat) {

                func();

            } else {

                _funcsCache.push(func);

            }

        }
 
     };

    //加载依赖
    function dependence ( callback ){

        var de = [], jsonStr, fStoreStr, fStr;

        if ( !JSON ) {

            jsonStr = 'lofty/util/json/1.0/json';

            de.push( jsonStr );

        }

        if ( !Util.support.localStorage ) {

            Engine = FlashEngineName;

            fStoreStr = 'lofty/util/storage/1.0/flashStorage';

            de.push( fStoreStr );

        }            

        require.use( de,function ( ){
        
            if(jsonStr) {
               
                JSON = require( jsonStr );

            }

            if( fStoreStr ){
                
                flashStorage = require( fStoreStr );

            }

            $.isFunction( callback ) && callback();

        });

    };

     /**
     * 初始化swf store
     */
    function _initSwfStore(){

        var container = $( '<div id="' + flashStorageId + '">' ).appendTo( 'body' ).css({

            position: 'absolute',

            left: '0px',

            top: '0px',

            width: '1px',

            height: '1px'

        });

        return  new flashStorage({

            container : '#' + flashStorageId

        });

    }
            
    /**
     * 完成组件初始化，改变状态，执行在完成之前滞留的动作
     */
    function _completeInit(){

        initStat = true;

        for (var i = 0, l = _funcsCache.length; i < l; i++) {

            _funcsCache[i]();

        }

    }


     Storage.init();

     return Storage;

});


