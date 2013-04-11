/**
 * @fileoverview unit testing for lofty/kernel/console
 * @author Edgar
 * @build 130325
 * */

describe( 'lofty/kernel/console', function(){
    
    var console = lofty.cache.kernel.console.exports;
    
    it( 'console', function(){
        console('�����Ǵ�ӡ��־','info');
        console('�����ǳ�����־','warn');
    } );
    
} );
