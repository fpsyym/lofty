/**
 * @fileoverview unit testing for lofty/kernel/debug
 * @author Edgar
 * @build 130325
 * */

describe( 'lofty/kernel/debug', function(){
    
    var originDebug = lofty.cache.config.debug;
    
    it( 'lofty.log', function(){
        lofty.config({
            debug: false
        });
        var a = lofty.log;
        
        lofty.config({
            debug: true
        });
        var b = lofty.log;
        
        a('���д�ӡ������','info');
        a('����Ҳ��ӡ������','warn')
        b('���Ǵ�ӡ��־','info');
        b('���ǳ�����־','warn');
        
        lofty.config({
            debug: originDebug
        });
    } );
    
} );
