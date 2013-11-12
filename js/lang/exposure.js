/*!!cmd:compress=true*/
/*!!cmd:jsCompressOpt=["--disable-optimizations"]*/

/**
 * @module lofty/device/exposure
 * @from lofty/lang/exposure
 * @author Edgar
 * @build 130523
 * */

define( 'lofty/lang/exposure', [
        'jquery'
    ], function( $ ){
    
    'use strict';
    
    var $win = $(window),
        $doc = $(document),
        isFunction = $.isFunction,
        
        windowHeight = 0,
        queue = [],
        isBind = false,
    
    //has = function( item ){
        //var has = false, i, l;
        //console.info(queue.length);
        //for ( i = 0, l = queue.length; i < l; i++ ){
            //console.info(item.callback == item.callback );
            //console.info(item.node[0]===queue[i].node[0]);
            //console.info(item == queue[i]);
            //if ( item.toString() === queue[i].toString() ){
            //    has = true;
            //    break;
            //}
        //}
        
        //return has;
    //},
    
    add = function( selector, callback, spacing, one ){
        
        var item = make( selector, callback, spacing ),
            i, l;
        
        l = item.node.length;
        
        if ( l > 1 ){
            for ( i = 0; i < l; i++ ){
                spinoff( item, i, one );
            }
            
            return;
        }
        
        queue.push( item );
    },
    
    make = function( selector, callback, spacing ){
        
        var item = {};
        
        if ( 'string' === typeof selector || 1 === selector.nodeType ){
            selector = $(selector);
        }
        
        item.node = selector.jquery && selector.length ? selector : [];
        item.spacing = spacing || 0;
        
        if ( isFunction( callback ) ) {
            item.callback = callback;
        }
        
        return item;
    },
    
    spinoff = function( item, i, one ){
        
        var sub = {
            node: item.node.eq(i),
            callback: item.callback,
            spacing: item.spacing
        };
        
        if ( one ){
            sub.selector = item.node.selector;
        }
        
        queue.push( sub );
        
    },
    
    bind = function(){
        
        var timer = null, interval = 200;
        
        windowHeight = $win.height();
        
        $win.bind( 'scroll.lofty/device/exposure', function(e){
            timer && clearTimeout( timer );
            timer = setTimeout( function(){
                poll();
            }, interval );
        } ).bind( 'resize.lofty/device/exposure', function(e){
            timer && clearTimeout( timer );
            timer = setTimeout( function(){
                windowHeight = $win.height();
                poll();
            }, interval );
        } );
        
        isBind = true;
        
    },
    
    poll = function(){
        
        if ( queue.length > 0 ){
            call();
        } else {
            unbind();
        }
        
    },
    
    call = function(){
        
        var item,
            ol = {
                i: 0
            };
        
        for ( ;ol.i < queue.length; ){
            item = queue[ol.i];
            if ( check( item.node, item.spacing ) ){
                remove( item, ol );
                item.callback && item.callback.call( null, item.node );
            } else {
                ol.i++;
            }
        }
        
        if ( queue.length === 0 ){
            unbind();
        }
        
    },
    
    check = function( $el, spacing ){
        
        var result = false;
        
        if ( $el.length > 0 ){
            var scrollTop = $doc.scrollTop(),
                heightDown = windowHeight + scrollTop + spacing,
                offsetTop = $el.offset().top,
                heightUp = offsetTop + $el.height() + spacing;
                
            if ( heightDown >= offsetTop && scrollTop <= heightUp && $el.is(':visible') ){
                result = true;
            }
        }
        
        return result;
        
    },
    
    remove = function( item, ol ){
        
        var selector = item.selector,
            j;
        
        if ( selector ){
            
            for ( j = 0; j < queue.length; ){
                if ( queue[j].selector === selector ){
                    queue.splice( j, 1 );
                    j < ol.i && ol.i--;
                } else {
                    j++;
                }
            }
            
        } else {
            queue.splice( i, 1 );
        }
        
    },
    
    unbind = function(){
        
        if ( !isBind ){
            return;
        }
        
        $win.unbind( 'resize.lofty/device/exposure' )
            .unbind( 'scroll.lofty/device/exposure' );
        
        isBind = false;
        
    },
    
    init = function(){
        
        if ( !isBind ){
            bind();
        }
        
        call();
        
    };
    
    
    return {
        bind: function( selector, callback, spacing, one ){
            
            if ( 'boolean' === typeof spacing ){
                one = spacing;
                spacing = null;
            }
            
            add( selector, callback, spacing, one );
            
            init();

        },
        
        trigger: function(){
            
            poll();
            
        }
    };
    
} );
