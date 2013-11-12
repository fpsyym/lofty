lofty.config({
	amd: true
});
define(['jquery','fui/paging/1.0'], function( $,Paging){
	
	describe( 'Pagingæ≤Ã¨‰÷»æ≤‚ ‘', function(){
		beforeEach(function(){
			var html = '<div id="dynamic_paging"></div>';
			$('body').prepend(html);
		})
		afterEach(function(){
			//$('#dynamic_paging').remove();
		});
		it('”√¿˝1:',function(){
			var pg = new Paging({
				container:'#dynamic_paging',
				onRender:function(page){
					console.log(page);
				}
			});
			//expect(1).toEqual(1);
		});
		
		
	});
	
	
	
	
});