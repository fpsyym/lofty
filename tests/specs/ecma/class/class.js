/**
 * @fileoverview unit testing for lofty/ecma/class
 * @author Edgar
 * @build 130521
 * */

//describe( 'lofty/ecma/class', function(){
            
    define(['lofty/ecma/class'], function( Class ){
        //console.info(Class);
        var A = Class( {
            init: function( a ){
                this.a = a;
            },
            id: 'wwe',
            array: ['a']
        } );
        
        var a = new A('init-a');
        var b = new A('niit-b');
        var c = A('inod-c');
        
        console.info(a instanceof A);
        console.info(b instanceof A);
        console.info(a!==b);
        console.info(a!=b);
        console.info(a.a==b.a);
        console.info(c);
        console.info(c instanceof A);
        
        var B = Class( A, {
            init: function( b ){
                this.b = b;
            },
            id: 'bbb',
            ar: 123
        } );
        
        var d = new B('b-init');
        console.info(d instanceof B);
        console.info(d.b==='b-init');
        console.info(d.id==='bbb');
        
    } );
//});
