lofty.config({
	amd: true
});
define(['jquery','fui/autocomplete/1.0','lofty/ui/autocomplete/1.0/filter'], function( $,Autocomplete,Filter){
	describe( 'Autocomplete ����ӿڲ���', function(){
		var autoComplete;
		beforeEach(function(){
			$('body').append('<input type="text" id="autoInputId" style="padding:0;margin:0;height:20px;position:absolute;border:none;"></input>')
			var data =  [
				{value:"shanghai",label:"�Ϻ�",alias:['sh','shh','�Ϻ�']},
				{value:"xian",label:"����",alias:['xa','����']},
				{value:"chengdu",label:"�ɶ�",alias:['cd','chd','�ɶ�']},
				{value:"shenzhen",label:"����",alias:['sz','shzh','szh','����']},
				{value:"beijing",label:"����",alias:['bj','����']},
				{value:"hangzhou",label:"����",alias:['hz','����']}
			];
 
			autocomplete = new Autocomplete({
				target:"#autoInputId",
				dataSource:data
			});
		})
		afterEach(function(){
			$("#autoInputId").remove();
			$('.fui-autocomplete').remove();
		});
		it('�ӿ�:resetPosition()',function(){
			$('#autoInputId').val('s');
			$('#autoInputId').trigger('keydown');
			$('#autoInputId').trigger('keyup');
			$('#autoInputId').css({
				left:'100px',
				top:'50px'
			})
			autocomplete.resetPosition();
			var offset = $('.fui-autocomplete').offset();
			
			expect(offset.left).toEqual(100);
			expect(offset.top).toEqual(70);
		});
		it('�ӿ�:setDisabled()',function(){
			autocomplete.setDisabled(true);
			$('#autoInputId').val('s');
			$('#autoInputId').trigger('keydown');
			$('#autoInputId').trigger('keyup');
			var display = $('.fui-autocomplete').css('display');
			expect(display).toEqual("none");
			
			autocomplete.setDisabled(false);
			$('#autoInputId').val('s');
			$('#autoInputId').trigger('keydown');
			$('#autoInputId').trigger('keyup');
			display = $('.fui-autocomplete').css('display');
			expect(display).toEqual("block");
		});
	});
	
	describe( 'Autocomplete ������', function(){
		var data =  [
			{value:"shanghai",label:"�Ϻ�",alias:['sh','shh','�Ϻ�']},
			{value:"xian",label:"����",alias:['xa','����']},
			{value:"chengdu",label:"�ɶ�",alias:['cd','chd','�ɶ�']},
			{value:"shenzhen",label:"����",alias:['sz','shzh','szh','����']},
			{value:"beijing",label:"����",alias:['bj','����']},
			{value:"hangzhou",label:"����",alias:['hz','����']}
		];
		beforeEach(function(){
			$('body').append('<input type="text" id="autoInputId" style="padding:0;margin:0;height:20px;width:100px;border:none;"></input>') 
		})
		afterEach(function(){
			$("#autoInputId").remove();
			$('.fui-autocomplete').remove();
		});
		it('Ĭ��������ֵ����',function(){
			var autocomplete = new Autocomplete({
				target:"#autoInputId",
				dataSource:data
			});
			$('#autoInputId').val('s');
			$('#autoInputId').trigger('keydown');
			$('#autoInputId').trigger('keyup');
			var width = $('.fui-autocomplete').outerWidth();
			expect(width).toEqual(100);
			var display = $('.fui-autocomplete').css('display');
			expect(display).toEqual('block');
			var focus = $($('.fui-autocomplete ul li')[0]).hasClass('fui-autocomplete-current-item');
			expect(focus).toEqual(true);
			var targetOffset = $('#autoInputId').offset();
			var offset = $('.fui-autocomplete').offset();
			expect(offset.left).toEqual(targetOffset.left);
			expect(offset.top).toEqual(targetOffset.top + 20);
		});
		it('width:ָ�����Ϊ�̶�ֵ',function(){
			var autocomplete = new Autocomplete({
				target:"#autoInputId",
				dataSource:data,
				width:500
			});
			$('#autoInputId').val('s');
			$('#autoInputId').trigger('keydown');
			$('#autoInputId').trigger('keyup');
			var display = $('.fui-autocomplete').outerWidth();
			expect(display).toEqual(500);
		});
		it('disabled:����Ĭ��Ϊ����',function(){
			var autocomplete = new Autocomplete({
				target:"#autoInputId",
				dataSource:data,
				disabled:true
			});
			$('#autoInputId').val('s');
			$('#autoInputId').trigger('keydown');
			$('#autoInputId').trigger('keyup');
			var display = $('.fui-autocomplete').css('display');
			expect(display).toEqual('none');
		});
		it('autoFocus:����ΪĬ�ϲ�ѡ�е�һ��',function(){
			var autocomplete = new Autocomplete({
				target:"#autoInputId",
				dataSource:data,
				autoFocus:false
			});
			$('#autoInputId').val('s');
			$('#autoInputId').trigger('keydown');
			$('#autoInputId').trigger('keyup');
			var focus = $($('.fui-autocomplete ul li')[0]).hasClass('fui-autocomplete-current-item');
			expect(focus).toEqual(false);
		});
		it('dLeft,dTop:΢��',function(){
			var autocomplete = new Autocomplete({
				target:"#autoInputId",
				dataSource:data,
				dLeft:-20,
				dTop:30
			});
			$('#autoInputId').val('s');
			$('#autoInputId').trigger('keydown');
			$('#autoInputId').trigger('keyup');
			
			var targetOffset = $('#autoInputId').offset();
			var offset = $('.fui-autocomplete').offset();
			expect(offset.left).toEqual(targetOffset.left + 20);
			expect(offset.top).toEqual(targetOffset.top - 10);
		});
		it('delay:���������ݴ����ʱ�����������ַ���С���ʱ��',function(){
			var autocomplete = new Autocomplete({
				target:"#autoInputId",
				dataSource:data,
				delay:300
			});
			var display,flag=false;
			$('#autoInputId').val('s');
			$('#autoInputId').trigger('keydown');
			$('#autoInputId').trigger('keyup');			
			setTimeout(function(){
				display = $('.fui-autocomplete').css('display');
				expect(display).toEqual('none');
				$('#autoInputId').val('sh');
				$('#autoInputId').trigger('keydown');
				$('#autoInputId').trigger('keyup');	
				setTimeout(function(){
					display = $('.fui-autocomplete').css('display');
					expect(display).toEqual('none');
					setTimeout(function(){
						display = $('.fui-autocomplete').css('display');
						expect(display).toEqual('block');
						flag = true;
					},260)
				},260)
			},260)
			
			waitsFor(function(){
				return flag;
			},'error',60000);
		});
		
		it('filter:����filter',function(){
			var filterData = Filter.startsWith(data,'h');
			expect(filterData.length).toEqual(1);
			
			filterData = Filter.stringMatch(data,'h');
			expect(filterData.length).toEqual(4);
			
			filterData = Filter.stringMatch(data,'a');
			expect(filterData.length).toEqual(3);
		});
		
	});
});