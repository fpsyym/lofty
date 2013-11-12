lofty.config({
	amd: true
});
define(['jquery','fui/placeholder/1.0'], function($,Placeholder){
	var tab;
	describe( 'Placeholder', function(){
		beforeEach(function(){
			var html = '<div style="position:relative;margin:20px"> \
							<input id="targetId" type="text" placeholder="这是placeholder测试" style="position:absolute;left:0;top:0;padding:3px;margin:2px;border:1px solid grey; width:200px;height:20px;"/> \
						</div>';
			$('body').prepend(html);
		})
		afterEach(function(){
			//$('#targetId').remove();
			//$('.pld-tip').remove();
		});
		it('接口测试：reset()',function(){
			var pld = new Placeholder({
				elemArr: $("#targetId"),
				shield: true
			});
			var targetOffset = $('#targetId').offset();
			var tipOffset = $('.pld-tip').offset();
			expect(parseInt(targetOffset.left,10)).toEqual(parseInt(tipOffset.left-2,10));
			expect(parseInt(targetOffset.top,10)).toEqual(parseInt(tipOffset.top,10));
		});
	});
});