/**
 * @fileoverview unit testing for lofty/kernel/appframe
 * @author Edgar
 * @build 130129
 * */



describe( 'lofty/kernel/appframe', function(){
    
    describe( 'lofty.appframe', function(){
        it( '����appframe', function(){
            window.alpha = null;
            
            lofty.appframe('alpha');
            
            define(['config'],function(config){
                config({
                    rAppframeExcept: /module/
                });
            });
            
            expect(!!window.alpha).toEqual(true);
            expect(alpha.define).toEqual(lofty.define);
        } );
        
        it( '���洢ʱģ��id����appframeǰ׺', function(){
            var a;
            
            define( 'specs/kernel/appframe/a', ['module'], function( module ){
                return module.id;
            } );
            define(['specs/kernel/appframe/a'],function(A){
                a = A;
            });
            
            expect(a).toEqual('specs/kernel/appframe/a');
            expect(lofty.cache.modules['alpha:specs/kernel/appframe/a'].exports).toEqual('specs/kernel/appframe/a');
        } );
        
        it( '��appframe���棬ͬ��ģ��require��ȷ', function(){
            var a, b;
            
            define( 'specs/kernel/appframe/b', function(){ return 1;} );
            define(['specs/kernel/appframe/b'],function(A){ a = A; });
            
            lofty.appframe('beta');
            define( 'specs/kernel/appframe/b', function(){ return 2; } );
            define(['specs/kernel/appframe/b'],function(A){ b = A; });
            
            expect(a).toEqual(1);
            expect(b).toEqual(2);
            expect(!!lofty.cache.modules['alpha:specs/kernel/appframe/b']).toEqual(true);
            expect(!!lofty.cache.modules['beta:specs/kernel/appframe/b']).toEqual(true);
        } );
    } );
    
} );
