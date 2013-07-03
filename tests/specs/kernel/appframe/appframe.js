/**
 * @fileoverview unit testing for lofty/kernel/appframe
 * @author Edgar
 * @build 130703
 * */

describe( 'lofty/kernel/appframe', function(){
    
    describe( '生成应用框架', function(){
        it( 'lofty.appframe', function(){
            lofty.appframe('alpha');
            
            expect(alpha.define).toEqual(lofty.define);
            //expect(alpha.log).toEqual(lofty.log);
            expect(alpha.config).toEqual(lofty.config);
            expect(alpha.on).toEqual(lofty.on);
            expect(alpha.off).toEqual(lofty.off);
        } );
    } );
} );
