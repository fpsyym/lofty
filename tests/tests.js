/**
 * @fileoverview for lofty unit testing
 * @author Edgar
 * @date 130217
 * */


define(['config'], function(config){
    
    var rRoot = /^specs\//;
    
    config({
        hasStamp: true,
        resolve: function( id ){
            
            if ( rRoot.test(id) ){
                id = '/tests/' + id;
            }
            
            return id;
        }
    });
    
    
});
