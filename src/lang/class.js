/**
 * @module lofty/lang/class
 * @from just/lang/class butterfly.lang.class
 * @author Edgar
 * updated terence.wangt 20130701  add muliple class inherit support
 * @build 120628
 * */

define( 'lofty/lang/class', function(){
    
	
	var proxy = function(){};
	
	function Class( parent, o ){
		
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
        
        klass.prototype = mixin( proto, o );
		
        return klass;
	}

	Class.extend = function ( target, parents, o ){

		if(!isFunction( target ) || !parents){ 
			return target;
		}
		
		isArray(parents) || (parents = [parents]);
		if(o) parents.push(o);
		
		var parent;
		while (parent = parents.shift()) {
			mixin(target.prototype, parent.prototype || parent);
		}
		return target;
	};
	
    var toString = {}.toString,
        isFunction = function( it ){
            return toString.call( it ) === '[object Function]';
        },
		isArray = Array.isArray || function(it) {
			return toString.call(it) === '[object Array]'
		},
        mixin = function( target, src ){
            var val;
            
            for ( var name in src ){
                val = src[name];
                if ( val !== undefined ){
                    target[name] = val;
                }
            }
            
            return target;
        };
    
    return Class;
    
} );
