/*!!cmd:compress=true*/
/*!!cmd:jsCompressOpt=["--disable-optimizations"]*/

/**
 * @module lofty/ui/dialog
 * @author wb_wanli.hewl
 * @date 20130813
 * */
 
define( 'lofty/ui/dialog/1.0/dialog', ['lofty/lang/class', 'lofty/ui/widget/1.0/widget','lofty/ui/dragdrop/1.0/dragdrop','jquery'], function(Class, Widget, Dragdrop, $) {
    'use strict';

	 var Dialog = Class ( Widget, {
			options: {
				zindex:1688,
				isModal:false
			},
			
			_create:function (){
				var outerBox=this.get('el'),
					that=this,
					buttons=this.get('buttons');

					//��������Ĭ������
					outerBox.css({
						'position':'absolute',
						'z-index':this.get('zindex'),
						'display':'none'
					});
					//���ø߶�
					if(this.get('height')){
						outerBox.css({
							'height':this.get('height')
						});
					}
					//���ÿ��
					if(this.get('width')){
						outerBox.css({
							'width':this.get('width')
						});
					}
					//ע��buttons�¼�
					if(buttons!==undefined){
						(function(){
							for(var i=0 ;i<buttons.length;i++){
								(function(i){
									var button=buttons[i];
									outerBox.on(buttons[i].event,buttons[i].selector,function(event){
										_predf(event);
										button.callback.call(that,button.paramObj);
									});
								})(i)
							}
						})();
					}
			},

			//����
			modal:function(config){
				var maskConfig={//modal��Ĭ������
						maskColor:'#000',
						maskOpacity:"0.3",
						maskOutTime:0
					},
					maskElment=this.get('maskElment'),
					ie6=$.browser.msie && ($.browser.version == "6.0") && !$.support.style;

				//�ϲ��Զ������ú�Ĭ������
				$.extend(true, maskConfig, config);
				//����������ֵ�Ԫ�ز������򴴽���Ԫ�أ�����ʼ�������style���ԣ����������ʹ���Ѿ����ڵ�Ԫ��
				if(!maskElment){
			  		maskElment=$('<div></div>');
			  		maskElment.css({
			  			'position':'absolute',
			  			'top' : '0px',
			  			'left' : '0px',
			  			'display':'none'
			  		});
			  		//�Ѵ���������Ԫ����ӵ�body��
			  		maskElment.appendTo('body');

			  		//�ѵ�ǰΪudefined��maskElmentԪ������Ϊ�մ���������maskElmentԪ��
			  		this.set('maskElment',maskElment);
		  		};
		  		//ֻ������Ļδ����������²���������Ļ
		  		if(maskElment.is(":hidden")){
			  		//�����û����õ�����
			  		maskElment.css({
				  			'z-index':this.get('zindex')-1,
				  			'background':maskConfig.maskColor
				  		}).animate({
				  			opacity:maskConfig.maskOpacity
				  		},maskConfig.maskOutTime);

			  		//���øߺͿ�
					maskElment.width($(window).width()+$(window).scrollLeft());
					maskElment.height($(window).height()+$(window).scrollTop());
					maskElment.slideDown(100);

					//���ù�����
					($.browser.mozilla==true&&parseFloat($.browser.version < 4 ))? 
						document.body.style.overflow = 'hidden' :
						document.documentElement.style.overflow = 'hidden';

					//��ֹĬ���¼�
					maskElment.on('mousedown',_predf);
					maskElment.on('mouseup',_predf);
					maskElment.on('selectstart',_predf);
				}
				//����ie6�������޷��ڸ�ѡ����bug
				//����������ü�Ȼ������״̬�����Ծ�������selectԪ�ز��ɼ�
				if(ie6){
					$('select').css({
						'visibility': 'hidden'
					});
				}
			},

			//����
			unModal:function(){

				var maskElment=this.get('maskElment'),
					ie6=$.browser.msie && ($.browser.version == "6.0") && !$.support.style;

				if(!!maskElment&&maskElment.is(":visible")){
					maskElment.slideUp(100);
					$(window).off('resize',this.resize);
					($.browser.mozilla==true&&parseFloat($.browser.version < 4 ))?
					 	document.body.style.overflow = 'auto' :
					 	document.documentElement.style.overflow = 'auto';
					$(document).off('mousedown',_predf);
					$(document).off('mouseup',_predf);
					$(document).off('selectstart',_predf);
				}

				//����ie6�������޷��ڸ�ѡ����bug
				//���������û�ԭselcetԪ�ؿɼ�
				if(ie6){
					$('select').css({
						'visibility': 'visible'
					});
				}
				
			},

			//�Ƴ���̬������Ԫ��
			remove:function(){

				var maskElment=this.get('maskElment'),
					outerBox=this.get('el');

				//�Ƴ�����
				if(!maskElment&&maskElment.is(":hidden")){
					maskElment.remove();
					this.set('maskElment',null);
				}

				if(!outerBox&&outerBox.is(":hidden")){
					outerBox.remove();
				}
			},

			show:function(contentObj){
				if(this.get("isShow")) return;
				var outerBox=this.get('el'),
					that=this,
					content=this.get("content"),
					ie6=$.browser.msie && ($.browser.version == "6.0") && !$.support.style,
					timers=this.get('timers'),
					area=[];

				if(this.get('isModal')===true){
					this.modal();
				}

				if(!content){
					outerBox.appendTo('body');

					if(contentObj!==undefined){
						if(contentObj.txt!==undefined){
							content=$(contentObj.txt);
						}else if(contentObj.selector!==undefined){
							content=$(contentObj.selector);
						}else{
							throw new Error("Dialog Show�����Ĳ������벻�Ϸ�");
						}
					}else{
						throw new Error("Dialog Show�����Ĳ������벻�Ϸ�");
					}

					content.show(0);
					if(ie6){//���ĵ�ie6,select�����������
						content.css({'position': 'relative','z-index': '2'});
						$("<iframe></iframe>").css({
							'position':'absolute',
							'top':'0px',
							'left':'0px',
							'z-index':'0',
							'border':'none'
						}).height(content.height()).width(content.width()).appendTo(outerBox);
					}
					this.set('content',content);
					outerBox.html(content);
				}
				outerBox.show(100);
				this.position();//����dialog��λ��

				if(this.get('isModal')===true){
					area=[	
							$(document).scrollLeft(),
							$(document).scrollLeft()+$(window).width()-content.width(),
							$(document).scrollTop(),
							$(document).scrollTop()+$(window).height()-content.height()
						];
				}
				//�����Ϸ�
				if(this.get('dragAble')&&!this.get('dragObject')){
					this.set('dragObject',new Dragdrop({
							target:outerBox.eq(0)[0],
							bridgeSelector:this.get('dragSelector'),
							area:area
						}));
				}

				//ע��timers�ص�
				if(timers!==undefined){
					(function(){
						for(var i=0 ;i<timers.length;i++){
							(function(i){
								var timer=timers[i];
								setTimeout(function(){
										timer.callback.call(that,timer.paramObj);
									},timer.time);
							})(i)
						}
					})();
				}

				//����չʾ״̬
				this.set("isShow",true)
			},

			hide:function(){
				var outerBox=this.get('el'),
				ie6=$.browser.msie && ($.browser.version == "6.0") && !$.support.style;
				outerBox.hide(100);
				this.unModal();
				this.set("isShow",false)
			},

			position:function(config){
				var top=this.get('y'),
					left=this.get('x'),
					win=$(window),
					outerBox=this.get('el'),
					content=this.get('content'),
					centerTop=(win.height()-content.height())/2+win.scrollTop(),
					centerLeft=(win.width()-content.width())/2+win.scrollLeft();

				centerTop=centerTop>0?centerTop:0;
				centerLeft=centerLeft>0?centerLeft:0;

				if(!!config){
					top=config.y?config.y:top;
					left=config.x?config.x:left;
					this.set('y',top);
					this.set('x',left);
				};

				top?
					outerBox.css({'top': top}):
					outerBox.css({'top': centerTop+'px'});
				left?
					outerBox.css({'left': left}):
					outerBox.css({'left': centerLeft +'px'});
			},
			//���Ĭ���¼�
			events:{
			   'window':{
			   		'resize': 'resize'
				}
			},
		  	resize:function(e){

			   	var maskElment=this.get('maskElment'),
			   		outerBox=this.get('el');

				if(!!maskElment&&maskElment.is(":visible")){
				   	maskElment.width($(window).width()+$(window).scrollLeft());
					maskElment.height($(window).height()+$(window).scrollTop());
					if(this.get('dragAble')&&this.get('dragObject')&&!this.get('x')&&!this.get('y')){
						this.get('dragObject').setArea(
							[	
								$(document).scrollLeft(),
								$(document).scrollLeft()+$(window).width()-outerBox.width(),
								$(document).scrollTop(),
								$(document).scrollTop()+$(window).height()-outerBox.height()
							]
						);
					}
				}
				if(outerBox.is(":visible")){
					this.position();
				}
			}
		  });

	 return Dialog;

	 //===================����Ϊ�ڲ�˽�з���=================//
	 //��ֹĬ����Ϊ
	 function _predf(e){
	  	e.preventDefault();
	 };
});
