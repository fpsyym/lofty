lofty.config({
	amd: true
});
define(['jquery','fui/position/1.0'], function( $,Position){
	
	describe( 'position ����', function(){
		beforeEach(function(){
			var html = '<div id="baseContainer" style="margin-left:400px">\
							<div id="baseNode" style="height:200px;width:200px;background-color:green"></div>\
						</div>';
			$('body').prepend(html);

			
		})
		afterEach(function(){
			$('#baseContainer').remove();
		});
		it('����1:��ͨԪ�صĶ�λ:offsetX,offsetY��ΪĬ��ֵ',function(){
			var targetHtml = '<div id="targetNode" style="margin:20px;width:50px;height:50px;background-color:red">';
			$('body').prepend(targetHtml);
			var position = new Position({
				targetNode:"#targetNode",
				baseNode:"#baseNode"
			});
			var baseOffset = $('#baseNode').offset();
			var targetOffset = $('#targetNode').offset();
			expect(baseOffset.top).toEqual(targetOffset.top);
			expect(baseOffset.left).toEqual(targetOffset.left);
			expect($("#targetNode").css("position")).toEqual("absolute");
			$('#targetNode').remove();
		});
		it('����2:��ͨԪ�صĶ�λ:offsetX,offsetYָ������ֵ',function(){
			var targetHtml = '<div id="targetNode" style="margin:20px;width:50px;height:50px;background-color:red">';
			$('body').prepend(targetHtml);
			var position = new Position({
				targetNode:"#targetNode",
				baseNode:"#baseNode",
				offsetX:'20px',
				offsetY:'30px'
			});
			var baseOffset = $('#baseNode').offset();
			var targetOffset = $('#targetNode').offset();
			
			expect(baseOffset.top + 30).toBeCloseTo(targetOffset.top, 0);
			expect(baseOffset.left + 20).toBeCloseTo(targetOffset.left, 0);
			expect($("#targetNode").css("position")).toEqual("absolute");
			
			
			position.setOffsetX('10%');
			position.setOffsetY('bottom')
			position.locate();
			
			baseOffset = $('#baseNode').offset();
			targetOffset = $('#targetNode').offset();
			expect(baseOffset.top + 150).toBeCloseTo(targetOffset.top, 0);
			expect(baseOffset.left + 15).toBeCloseTo(targetOffset.left, 0);
			
			position.setOffsetX('10%+30px');
			position.setOffsetY('bottom-10px')
			position.locate();
			
			baseOffset = $('#baseNode').offset();
			targetOffset = $('#targetNode').offset();
			expect(baseOffset.top + 140).toBeCloseTo(targetOffset.top, 0);
			expect(baseOffset.left + 45).toBeCloseTo(targetOffset.left, 0);
			
			position.setOffsetX('-10%+30px');
			position.setOffsetY('-(bottom-10px)')
			position.locate();
			
			baseOffset = $('#baseNode').offset();
			targetOffset = $('#targetNode').offset();
			expect(baseOffset.top - 140).toBeCloseTo(targetOffset.top, 0);
			expect(baseOffset.left + 15).toBeCloseTo(targetOffset.left, 0);
			
			$('#targetNode').remove();
		}); 
		it('����3:���Զ�λ��Ԫ��',function(){
			var targetHtml = '<div id="targetContainer" style="position:relative;margin:50px;padding:20px;left:10px;top:10px">\
								<div id="targetNode" style="position:absolute;width:50px;height:50px;background-color:red"></div>\
							  </div>';
			$('body').prepend(targetHtml);
			var position = new Position({
				targetNode:"#targetNode",
				baseNode:"#baseNode"
			});
			var baseOffset = $('#baseNode').offset();
			var targetOffset = $('#targetNode').offset();
			expect(baseOffset.top).toEqual(targetOffset.top);
			expect(baseOffset.left).toEqual(targetOffset.left);
			expect($("#targetNode").css("position")).toEqual("absolute");
			
			position.setOffsetX('10%+30px');
			position.setOffsetY('bottom-10px')
			position.locate();
			
			baseOffset = $('#baseNode').offset();
			targetOffset = $('#targetNode').offset();
			expect(baseOffset.top + 140).toBeCloseTo(targetOffset.top, 0);
			expect(baseOffset.left + 45).toBeCloseTo(targetOffset.left, 0);
			$('#targetContainer').remove();
		});
		it('����4:��Զ�λ��Ԫ��',function(){
			var targetHtml = '<div id="targetNode" style="position:relative;width:50px;height:50px;margin:50px;left:100px;top:200px;background-color:red">\
							  </div>';
			$('body').prepend(targetHtml);
			var position = new Position({
				targetNode:"#targetNode",
				baseNode:"#baseNode"
			});
			var baseOffset = $('#baseNode').offset();
			var targetOffset = $('#targetNode').offset();
			expect(baseOffset.top).toEqual(targetOffset.top);
			expect(baseOffset.left).toEqual(targetOffset.left);
			expect($("#targetNode").css("position")).toEqual("relative");
			
			position.setOffsetX('10%');
			position.setOffsetY('bottom')
			position.locate();
			
			baseOffset = $('#baseNode').offset();
			targetOffset = $('#targetNode').offset();
			expect(baseOffset.top + 150).toBeCloseTo(targetOffset.top, 0);
			expect(baseOffset.left + 15).toBeCloseTo(targetOffset.left, 0);		
			$('#targetNode').remove();
		});
		it('����4:fixed��λ��Ԫ��',function(){
			var targetHtml = '<div id="targetNode" style="position:fixed;width:50px;height:50px;margin:50px;left:100px;top:200px;background-color:red">\
							  </div>';
			$('body').prepend(targetHtml);
			var position = new Position({
				targetNode:"#targetNode",
				baseNode:"#baseNode"
			});
			var baseOffset = $('#baseNode').offset();
			var targetOffset = $('#targetNode').offset();
			expect(baseOffset.top).toEqual(targetOffset.top);
			expect(baseOffset.left).toEqual(targetOffset.left);
			expect($("#targetNode").css("position")).toEqual("absolute");
			
			position.setOffsetX('10%');
			position.setOffsetY('bottom')
			position.locate();
			
			baseOffset = $('#baseNode').offset();
			targetOffset = $('#targetNode').offset();
			expect(baseOffset.top + 150).toBeCloseTo(targetOffset.top, 0);
			expect(baseOffset.left + 15).toBeCloseTo(targetOffset.left, 0);		
			$('#targetNode').remove();
		});
		
		
	});
	
	
	
	
});