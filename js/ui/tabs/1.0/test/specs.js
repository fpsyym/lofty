lofty.config({
	amd: true
});
define(['jquery','fui/tabs/1.0'], function( $,Tabs){
	var tab;
	describe( 'Tabs 静态渲染,接口测试', function(){
		beforeEach(function(){
			var html = '<div class="fui-tab" id="staticTab">\
							<div class="fui-t"> \
								<ul class="fui-tab-ul"> \
									<li class="fui-tab-t"><a href="#" target="_self">选项卡4</a></li>\
									<li class="fui-tab-t"><a href="#" target="_self">选项卡5</a></li>\
									<li class="fui-tab-t"><a href="#" target="_self">选项卡6</a></li>\
								</ul>\
							</div>\
							<div class="fui-d"> \
							<div class="fui-tab-b">tab1</div>\
								<div class="fui-tab-b">tab2</div>\
								<div class="fui-tab-b">tab3</div>\
							</div> \
						</div>';
			$('body').append(html);

			tab = new Tabs({
				tpl:'#staticTab'
			});

		})
		afterEach(function(){
			$('#staticTab').remove();
		});
		it('接口:switchTo(index)',function(){
			var tab_t_idx = $('#staticTab .fui-t .fui-tab-ul .fui-tab-t').index($('#staticTab .fui-t .fui-tab-ul .fui-tab-current'));
			var tab_b_idx = $('#staticTab .fui-d .fui-tab-b').index($('#staticTab .fui-d .fui-tab-current'));
			expect(tab_t_idx).toEqual(0);
			expect(tab_b_idx).toEqual(0);
			tab.switchTo(2);
			tab_t_idx = $('#staticTab .fui-t .fui-tab-ul .fui-tab-t').index($('#staticTab .fui-t .fui-tab-ul .fui-tab-current'));
			tab_b_idx = $('#staticTab .fui-d .fui-tab-b').index($('#staticTab .fui-d .fui-tab-current'));
			expect(tab_t_idx).toEqual(2);
			expect(tab_b_idx).toEqual(2);
		});
		it('接口:prev() || next()',function(){
			var tab_t_idx = $('#staticTab .fui-t .fui-tab-ul .fui-tab-t').index($('#staticTab .fui-t .fui-tab-ul .fui-tab-current'));
			var tab_b_idx = $('#staticTab .fui-d .fui-tab-b').index($('#staticTab .fui-d .fui-tab-current'));
			expect(tab_t_idx).toEqual(0);
			expect(tab_b_idx).toEqual(0);
			tab.prev();
			tab_t_idx = $('#staticTab .fui-t .fui-tab-ul .fui-tab-t').index($('#staticTab .fui-t .fui-tab-ul .fui-tab-current'));
			tab_b_idx = $('#staticTab .fui-d .fui-tab-b').index($('#staticTab .fui-d .fui-tab-current'));
			expect(tab_t_idx).toEqual(0);
			expect(tab_b_idx).toEqual(0);
			
			tab.next();
			tab_t_idx = $('#staticTab .fui-t .fui-tab-ul .fui-tab-t').index($('#staticTab .fui-t .fui-tab-ul .fui-tab-current'));
			tab_b_idx = $('#staticTab .fui-d .fui-tab-b').index($('#staticTab .fui-d .fui-tab-current'));
			expect(tab_t_idx).toEqual(1);
			expect(tab_b_idx).toEqual(1);
			tab.next();
			
			tab_t_idx = $('#staticTab .fui-t .fui-tab-ul .fui-tab-t').index($('#staticTab .fui-t .fui-tab-ul .fui-tab-current'));
			tab_b_idx = $('#staticTab .fui-d .fui-tab-b').index($('#staticTab .fui-d .fui-tab-current'));
			expect(tab_t_idx).toEqual(2);
			expect(tab_b_idx).toEqual(2);
			tab.next();
			tab_t_idx = $('#staticTab .fui-t .fui-tab-ul .fui-tab-t').index($('#staticTab .fui-t .fui-tab-ul .fui-tab-current'));
			tab_b_idx = $('#staticTab .fui-d .fui-tab-b').index($('#staticTab .fui-d .fui-tab-current'));
			expect(tab_t_idx).toEqual(2);
			expect(tab_b_idx).toEqual(2);
			tab.prev();
			tab_t_idx = $('#staticTab .fui-t .fui-tab-ul .fui-tab-t').index($('#staticTab .fui-t .fui-tab-ul .fui-tab-current'));
			tab_b_idx = $('#staticTab .fui-d .fui-tab-b').index($('#staticTab .fui-d .fui-tab-current'));
			expect(tab_t_idx).toEqual(1);
			expect(tab_b_idx).toEqual(1);
		});
		
		it('接口:getLength()',function(){
			var len = tab.getLength();
			expect(len).toEqual(3);
		});
		it('接口:getCurrentIndex()',function(){
			var tab_t_idx = $('#staticTab .fui-t .fui-tab-ul .fui-tab-t').index($('#staticTab .fui-t .fui-tab-ul .fui-tab-current'));
			expect(tab_t_idx).toEqual(tab.getCurrentIndex());
			tab.switchTo(2);
			expect(2).toEqual(tab.getCurrentIndex());
		});
		
	});
	
	describe( 'Tabs 动态渲染,配置参数测试', function(){
		beforeEach(function(){
			var html = '<div id="dynamicTab"></div>';
			$('body').append(html);
		})
		afterEach(function(){
			$('#dynamicTab').remove();
		});
		it('默认配置：测试默认不自动轮播',function(){
			var flag=false;
			var tab = new Tabs({
				container:'#dynamicTab',
				items: [{
					label: 'Tab1',
					content: '<p> Tab1 content</p> '
				}, {
					label: 'Tab2',
					content: '<p> Tab2 content</p> '
				}, {
					label: 'Tab3',
					content: '<p> Tab3 content</p>'
				}]
			});
			setTimeout(function(){
				var tab_t_idx = $('#dynamicTab .fui-t .fui-tab-ul .fui-tab-t').index($('#dynamicTab .fui-t .fui-tab-ul .fui-tab-current'));
				var tab_b_idx = $('#dynamicTab .fui-d .fui-tab-b').index($('#dynamicTab .fui-d .fui-tab-current'));
				expect(tab_t_idx).toEqual(0);
				expect(tab_b_idx).toEqual(0);
				flag = true;
			},400);
			waitsFor(function(){
				return flag;
			},'error',500)
			
		});
		it('默认配置：默认切换事件为mouseenter',function(){
			var tab = new Tabs({
				container:'#dynamicTab',
				items: [{
					label: 'Tab1',
					content: '<p> Tab1 content</p> '
				}, {
					label: 'Tab2',
					content: '<p> Tab2 content</p> '
				}, {
					label: 'Tab3',
					content: '<p> Tab3 content</p>'
				}]
			});
			
			$($('#dynamicTab .fui-t .fui-tab-ul .fui-tab-t')[1]).trigger('mouseenter');
			var tab_t_idx = $('#dynamicTab .fui-t .fui-tab-ul .fui-tab-t').index($('#dynamicTab .fui-t .fui-tab-ul .fui-tab-current'));
			var tab_b_idx = $('#dynamicTab .fui-d .fui-tab-b').index($('#dynamicTab .fui-d .fui-tab-current'));
			expect(tab_t_idx).toEqual(1);
			expect(tab_b_idx).toEqual(1);
			$($('#dynamicTab .fui-t .fui-tab-ul .fui-tab-t')[0]).trigger('mouseenter');
			tab_t_idx = $('#dynamicTab .fui-t .fui-tab-ul .fui-tab-t').index($('#dynamicTab .fui-t .fui-tab-ul .fui-tab-current'));
			tab_b_idx = $('#dynamicTab .fui-d .fui-tab-b').index($('#dynamicTab .fui-d .fui-tab-current'));
			expect(tab_t_idx).toEqual(0);
			expect(tab_b_idx).toEqual(0);
			
		});
		
		it('默认配置：自动轮播',function(){
			var flag=false;
			var tab = new Tabs({
				container:'#dynamicTab',
				items: [{
					label: 'Tab1',
					content: '<p> Tab1 content</p> '
				}, {
					label: 'Tab2',
					content: '<p> Tab2 content</p> '
				}, {
					label: 'Tab3',
					content: '<p> Tab3 content</p>'
				}],
				autoPlay:'line',
				interval:100
			});
			var tab_t_idx = $('#dynamicTab .fui-t .fui-tab-ul .fui-tab-t').index($('#dynamicTab .fui-t .fui-tab-ul .fui-tab-current'));
			var tab_b_idx = $('#dynamicTab .fui-d .fui-tab-b').index($('#dynamicTab .fui-d .fui-tab-current'));
			expect(tab_t_idx).toEqual(0);
			expect(tab_b_idx).toEqual(0);
			setTimeout(function(){
				tab_t_idx = $('#dynamicTab .fui-t .fui-tab-ul .fui-tab-t').index($('#dynamicTab .fui-t .fui-tab-ul .fui-tab-current'));
				tab_b_idx = $('#dynamicTab .fui-d .fui-tab-b').index($('#dynamicTab .fui-d .fui-tab-current'));
				expect(tab_t_idx).toEqual(1);
				expect(tab_b_idx).toEqual(1);
				flag = true;
			},130);
			waitsFor(function(){
				return flag;
			},'error',150)
			
		});
		it('默认配置：切换事件设为click',function(){
			var tab = new Tabs({
				container:'#dynamicTab',
				items: [{
					label: 'Tab1',
					content: '<p> Tab1 content</p> '
				}, {
					label: 'Tab2',
					content: '<p> Tab2 content</p> '
				}, {
					label: 'Tab3',
					content: '<p> Tab3 content</p>'
				}],
				event:'click'
			});
			
			$($('#dynamicTab .fui-t .fui-tab-ul .fui-tab-t')[1]).trigger('mouseenter');
			var tab_t_idx = $('#dynamicTab .fui-t .fui-tab-ul .fui-tab-t').index($('#dynamicTab .fui-t .fui-tab-ul .fui-tab-current'));
			var tab_b_idx = $('#dynamicTab .fui-d .fui-tab-b').index($('#dynamicTab .fui-d .fui-tab-current'));
			expect(tab_t_idx).toEqual(0);
			expect(tab_b_idx).toEqual(0);
			$($('#dynamicTab .fui-t .fui-tab-ul .fui-tab-t')[1]).trigger('click');
			tab_t_idx = $('#dynamicTab .fui-t .fui-tab-ul .fui-tab-t').index($('#dynamicTab .fui-t .fui-tab-ul .fui-tab-current'));
			tab_b_idx = $('#dynamicTab .fui-d .fui-tab-b').index($('#dynamicTab .fui-d .fui-tab-current'));
			expect(tab_t_idx).toEqual(1);
			expect(tab_b_idx).toEqual(1);
			
		});
	});
	
	
});