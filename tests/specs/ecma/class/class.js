/**
 * @fileoverview unit testing for lofty/ecma/class
 * @author Edgar
 * @build 130521
 * */

define(['lofty/ecma/class'], function( Class ){
    describe( 'lofty/ecma/class', function(){
        
        var A = Class( {
            init: function( a ){
                this.a = a;
            },
            id: 'wwe',
            array: ['a']
        } );
        
        var B = Class( A, {
            init: function( b ){
                this.b = b;
            },
            id: 'bbb',
            ar: 123
        } );
        
        var e = new B('e-init');
        
        var C = Class( e, {
            init: function( c ){
                this.c = c;
            },
            a: 'cc'
        } );
        
        var D = Class({
            a: 'd-aa',
            b: 'd-bb'
        });
        
        var E = Class({
            init: function(e){
                this.e = e;
            }
        });
        
        it( '定义一个Class，用new创建对象', function(){
            var a = new A('init-a');
            var b = new A('niit-b');
            var c = new D();
            var d = new E();
            
            expect(a instanceof A).toEqual(true);
            expect(b instanceof A).toEqual(true);
            expect(c instanceof D).toEqual(true);
            expect(d instanceof A).toEqual(false);
            expect(a!==b).toEqual(true);
            expect(a!=b).toEqual(true);
            expect(a.a==b.a).toEqual(false);
        } );
        
        it( '不用new不能创建', function(){
            var c = A('inod-c');
            
            expect(c).toEqual(undefined);
            expect(c instanceof A).toEqual(false);
        } );
        
        it( '基于Class定义Class', function(){
            var d = new B('b-init');
            var a = new A();
            
            expect(a instanceof B).toEqual(false);
            expect(d instanceof B).toEqual(true);
            expect(d instanceof A).toEqual(true);
            expect(d.b==='b-init').toEqual(true);
            expect(d.id==='bbb').toEqual(true);
            expect(d.a).toEqual(undefined);
        } );
        
        it( '基于对象定义Class', function(){
            var f = new C('c-init');

            expect(f instanceof C).toEqual(true);
            expect(f instanceof B).toEqual(true);
            expect(f instanceof A).toEqual(true);
            expect(f.c==='c-init').toEqual(true);
            expect(f.b==='e-init').toEqual(true);
            expect(f.a==='cc').toEqual(true);
        } );
        
    } );
});
