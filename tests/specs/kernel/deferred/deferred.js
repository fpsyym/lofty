/**
 * @fileoverview unit testing for lofty/kernel/deferred
 * @author Edgar
 * @build 130322
 * */

describe( 'lofty/kernel/deferred', function(){
    
    var deferred = lofty.cache.kernel.deferred.exports;
    
    it( 'deferred resolve', function(){
        var a = [];
        
        var b = function( promise ){
            setTimeout(function(){
                a.push(4);
                promise.resolve();
            }, 1500 );
        },
        c = function( promise ){
            setTimeout(function(){
                a.push(5);
                promise.resolve();
            }, 1000 );
        };
        
        runs(function(){
            deferred( b, c ).then( function(){
                a.push(6);
            }, function(){
                a.push(7);
            } );
        });
        
        waitsFor(function(){
            return a.length === 3;
        });
        
        runs(function(){
            expect(a[a.length-1]).toEqual(6);
            expect(a.sort()).toEqual([4,5,6]);
        });
        
    } );
    
    it( 'deferred reject', function(){
        var a = [];
        
        var b = function( promise ){
            setTimeout(function(){
                a.push(4);
                promise.resolve();
            }, 1500 );
        },
        c = function( promise ){
            setTimeout(function(){
                a.push(5);
                promise.resolve();
            }, 500 );
        },
        d = function( promise ){
            setTimeout(function(){
                a.push(8);
                promise.reject();
            }, 1000 );
        };
        
        runs(function(){
            deferred( b, c, d ).then( function(){
                a.push(6);
            }, function(){
                a.push(7);
            } );
        });
        
        waitsFor(function(){
            return a.length === 4;
        });
        
        runs(function(){
            expect(a.sort()).toEqual([4,5,7,8]);
        });
        
    } );
    
    it( 'deferred����ʱ', function(){
        var a = [];
        
        var b = function( promise ){
            a.push(4);
            promise.resolve();
        },
        c = function( promise ){
            a.push(5);
            promise.resolve();
        };
        
        runs(function(){
            deferred( b, c ).then( function(){
                a.push(6);
            }, function(){
                a.push(7);
            } );
        });
        
        waitsFor(function(){
            return a.length === 3;
        });
        
        runs(function(){
            expect(a[a.length-1]).toEqual(6);
            expect(a.sort()).toEqual([4,5,6]);
        });
        
    } );
    
    it( 'deferred������ʱ���ֲ���ʱ', function(){
        var a = [];
        
        var b = function( promise ){
            a.push(4);
            promise.resolve();
        },
        c = function( promise ){
            setTimeout(function(){
                a.push(5);
                promise.resolve();
            }, 1000 );
        };
        
        runs(function(){
            deferred( b, c ).then( function(){
                a.push(6);
            }, function(){
                a.push(7);
            } );
        });
        
        waitsFor(function(){
            return a.length === 3;
        });
        
        runs(function(){
            expect(a[a.length-1]).toEqual(6);
            expect(a.sort()).toEqual([4,5,6]);
        });
        
    } );
    
} );
