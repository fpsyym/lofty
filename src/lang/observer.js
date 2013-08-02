/**
 * @module lofty/lang/observer
 * @from just/lang/observer
 * @author Edgar
 * @date 130521
 * */
 
define( 'lofty/lang/observer', function(){
    
    'use strict';
    
    /* lang support */
    var toString = {}.toString,
        isFunction = function( it ){
            return toString.call( it ) === '[object Function]';
        },
        isArray = Array.isArray || function( it ){
            return toString.call( it ) === '[object Array]';
        },
        isString = function( str ){
            return 'string' === typeof str;
        },
        slice = Array.prototype.slice;
    
    
    var MakeObserver = function( sender ){
        this.__observerContext = sender;
    };
    
    MakeObserver.prototype = {
        
        attach: function( names, listener, context ){
            
            var observerGroup, listeners, name;
            
            if ( isString( names ) ){
                names = [names];
            }
            
            if ( !isArray( names ) || !isFunction( listener ) ){
                return this;
            }
            
            observerGroup = this.__observerGroup || ( this.__observerGroup = {} );
            
            while ( name = names.shift() ){
                listeners = observerGroup[name] || ( observerGroup[name] = [] );
                listeners.push({
                    listener: listener,
                    context: context
                });
            }
            
            return this;
        },
        
        detach: function( names, listener, context ){
            
            var observerGroup, listeners, item, name, i;
            
            if ( !( observerGroup = this.__observerGroup ) ){
                return this;
            }
            
            if ( !names ){
                delete this.__observerGroup;
                return this;
            }
            
            if ( isString(names) ){
                names = [names];
            }
            
            if ( !isArray(names) ){
                return this;
            }
            
            while ( name = names.shift() ){
                
                if ( !( listeners = observerGroup[name] ) ){
                    continue;
                }
                
                if ( listener || context ){
                    for ( i = 0; i < listeners.length; ){
                        item = listeners[i];
                        if ( ( listener && item.listener === listener ) || ( context && item.context === context ) ){
                            listeners.splice( i, 1 );
                        } else {
                            i++;
                        }
                    }
                } else {
                    delete observerGroup[name];
                }
                
            }
            
            return this;            
            
        },
        
        notify: function( names ){
            
            var observerGroup, listeners, item, name, args, i, l;
            
            if ( !( observerGroup = this.__observerGroup ) ){
                return this;
            }
            
            args = slice.call( arguments, 1 );
            
            if ( isString(names) ){
                names = [names];
            }
            
            if ( !isArray(names) ){
                return this;
            }
            
            while ( name = names.shift() ){
                
                if ( !( listeners = observerGroup[name] ) ){
                    continue;
                }
                
                for ( i = 0, l = listeners.length; i < l; i++ ){
                    item = listeners[i];
                    item.listener.apply( item.context || this.__observerContext || this, args );
                }
                
            }
            
            return this;
            
        },
        
        on: function(){
            return this.attach.apply( this, arguments );
        },
        trigger: function(){
            return this.notify.apply( this, arguments );
        },
        off: function(){
            return this.detach.apply( this, arguments );
        }
    };
    
    
    
    /* api */
    var observer = {
        create: function( sender ){
            
            return new MakeObserver( sender );
        },
        mixin: function( target ){
            
            target = target || {};
            
            var tempObserver = new MakeObserver( target );
            
            for ( var fn in tempObserver ){
                target[fn] = tempObserver[fn];
            }
            
            //target.__mixin_observer = true;
            
            return target;
        }
    };
    
    return observer;
    
} );
