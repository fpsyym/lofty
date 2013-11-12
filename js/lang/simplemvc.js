/*!!cmd:compress=true*/
/*!!cmd:jsCompressOpt=["--disable-optimizations"]*/

/**
 * @module lofty/lang/simplemvc
 * @from just/lang/mvc
 * @require jquery, lofty/ecma/observer
 * @author Edgar
 * @date 130522
 * */

define( 'lofty/lang/simplemvc', [
        'jquery',
        'lofty/ecma/observer'
    ], function( $, observer ){
    
    'use strict';
    
    var isFunction = $.isFunction,
        noop = function(){};
    
    var modelInit = function(){
            this.observer = observer.create(this);
            
            this.start();
        },
        viewInit = function( model, controller, elements ){
            this.model = model;
            this.controller = controller;
            this.elements = elements;
            
            this.start();
        },
        controllerInit = function( model ){
            this.model = model;
            
            this.start();
        };
    
    var extend = function( target, initFn ){
            target = target || {};
            
            !target.start && ( target.start = noop );
            target.__simplemvcInit = initFn;
            
            return target;
        },
        viewStart = function( view ){
            for ( var fn in view ){
                if ( fn.indexOf('self') === 0 ){
                    isFunction( view[fn] ) && view[fn]();
                }
            }
        };
    
    
    var MakeSimpleMVC = function( model, view, controller ){
        this.model = extend( model, modelInit );
        this.controller = extend( controller, controllerInit );
        this.view = extend( view, viewInit );
    };
    
    MakeSimpleMVC.prototype = {
        /*
        makeModel: function( o ){
            this.model = $.extend( {}, this.model, o );
        },
        makeController: function( o ){
            this.controller = $.extend( {}, this.controller, o );
        },
        makeView: function( o ){
            this.view = $.extend( {}, this.view, o );
        },
        */
        startup: function( elements ){
            this.model.__simplemvcInit();
            this.controller.__simplemvcInit( this.model );
            this.view.__simplemvcInit( this.model, this.controller, elements );
            viewStart( this.view );
        }
    };
    
    
    var simplemvc = {
        create: function( model, view, controller ){
            return new MakeSimpleMVC( model, view, controller );
        }
    };
    
    return simplemvc;
    
});
