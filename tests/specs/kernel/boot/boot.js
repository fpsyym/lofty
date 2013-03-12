/**
 * @fileoverview unit testing for lofty/kernel/boot
 * @author Edgar
 * @build 130308
 * */

describe( 'lofty/kernel/boot', function(){

    describe( 'lofty�ؼ���', function(){
        it( '���ڹؼ���lofty', function(){
            expect(lofty).toBeTruthy();
        } );
    } );
    
    describe( 'loftyģ��', function(){
        it( 'normal', function(){
            var a, c;
            
            lofty( 'specs/kernel/boot/a', function(){
                a = 'a';
            } );
            
            lofty( 'specs/kernel/boot/b', function(){
                return 'b'
            } );
            
            lofty( 'specs/kernel/boot/c', ['specs/kernel/boot/b'], function(B){
                c = B + 'c';
            } );
            
            expect(a).toEqual('a');
            expect(c).toEqual('bc');
        } );
        
        it( '�ظ����壬�Ƚ�����', function(){
            var a;
            
            lofty( 'specs/kernel/boot/d', function(){
                return 'a';
            } );
            
            lofty( 'specs/kernel/boot/d', function(){
                return 'b';
            } );
            
            lofty( 'specs/kernel/boot/e', ['specs/kernel/boot/d'], function(D){
                a = D;
            } );
            
            expect(a).toEqual('a');
        } );
    } );
    
} );
