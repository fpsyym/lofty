/**
 * @module lofty/ecma/class
 * @from just/lang/class butterfly.lang.class
 * @author Edgar
 * @build 120628
 * */

define( 'lofty/ecma/class', function(){
    
    var toString = {}.toString,
        isFunction = function( it ){
            return toString.call( it ) === '[object Function]';
        },
        extend = function( target, src ){
            var val;
            
            for ( var name in src ){
                val = src[name];
                if ( val !== undefined ){
                    target[name] = val;
                }
            }
            
            return target;
        };
    
    var proxy = function(){};
    
    var makeClass = function( parent, o ){
        
        if ( !o ){
            o = parent;
            parent = null;
        }
        
        // http://ejohn.org/blog/simple-class-instantiation/
        var klass = function(){
            var init = this.initialize || this.init;
            
            isFunction( init ) && init.apply( this, arguments );
        };
        
        var proto = {};
        
        if ( parent ){
            proxy.prototype = isFunction( parent ) ? parent.prototype : parent;
            proto = new proxy();
        }
        
        klass.prototype = extend( proto, o );
        
        return klass;
        
    };
    
    return makeClass;
    
} );
