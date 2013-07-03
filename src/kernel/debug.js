/**
 * @module lofty/kernel/debug
 * @author Edgar <mail@edgarhoo.net>
 * @version v0.1
 * @date 130703
 * */


lofty( 'debug', ['config','log','event'],
    function( config, log, event ){
    'use strict';
    
    config.addRule( 'debug', function( target, key, val ){
        log.create( val );
        this[key] = val;
        return true;
    } )
    .addItem( 'debug', 'debug' );
    
    
    var configCache = this.cache.config,
    
    getId = function( mod ){
        return mod._id ? mod._id : mod.id;
    };
    
    
    event.on( 'existed', function( meta ){
        
        log.warn( meta.id + ': already exists.' );
    } );
    
    event.on( 'compiled', function( mod ){
        
        log.log( getId( mod ) + ': compiled.' );
    } );
    
    event.on( 'compileFail', function( ex, mod ){
        
        if ( !configCache.hasCatch || configCache.debug ){
            throw ex;
        }
    } );
    
    event.on( 'required', function( mod ){
        
        !mod.visits ? mod.visits = 1 : mod.visits++;
        log.log( mod.id + ': required ' + mod.visits + '.' );
    } );
    
    event.on( 'requireFail', function( meta ){
        
        log.warn( meta.id + ': does not exist.' );
    } );
    
    event.on( 'requested', function( asset ){
        
        log.log( asset.url + ' requested' );
    } );
    
    event.on( 'requestTimeout', function( asset ){
        
        log.warn( 'request ' + asset.url + ' timeout.' );
    } );
    
} );
