/*!!cmd:compress=true*/
/*!!cmd:jsCompressOpt=["--disable-optimizations"]*/

/**
 * @module lofty/ui/tip
 * @from 
 * @author chuanpeng.qchp
 * @date 20130822
 * */
  
define( 'lofty/ui/tip/1.0/tip', ['lofty/lang/class', 'lofty/ui/widget/1.0/widget','lofty/util/template/1.0/tplhandler','jquery'], 
	
  function( Class, Widget,TplHandler,$){
  'use strict';
    var Tip = Class( Widget, {
		options:{
			/* Ŀ��Ԫ��	*/
			target:"",
			
			/* �Ƿ�Բ�� --*/
			isRoundedCorner:true,   
			
			/* �Ƿ��йرհ�ť */
			hasCloseButton:false,
			
			/* ���йرհ�ťʱ,����رհ�ťʱ�ص���ҵ��ķ���*/
			onCloseButtonClick:$.noop, 
			
			/* ���� */
			content:'',		
			
			/* tips ���������λ�� 1:top left 2:top right 3:bottom left 4:bottom right 5:left top 6:left bottom 7:right top 8:right bottom -- */
			local: 1,  

			/* tips��arrow���λ�� 0:null 1:top left 2:top right 3:bottom left 4:bottom right 5:left top 6:left bottom 7:right top 8:right bottom 9:default -- */
			arrow: 9,
			
			/*��� Ĭ��Ϊ-1�������ⲿCSSָ��*/
			width:-1,
			
			/*����΢��*/
			dLeft:0,
			
			/*����΢��*/
			dTop:0,
			
			/*����ʾ�����ص�ʱ���Ƿ��ж���Ч����Ĭ��Ϊtrue*/
			isAnim:true,
			
			animTime:50,
			
			/*��꾭��tip��ʾ��ʱ����ʾ���Ƿ񱣳���ʾ״̬��Ĭ��Ϊtrue*/
			isHoverHold:true,
			
			/*����Ҫ����tipʱ���������ص��ӳ�ʱ�䣬��λ���룬Ĭ��Ϊ200���룬������Ϊ0ʱ�����ӳ�*/
			hideDelay:200,
			
			/*ҳ�������ɣ��Ƿ��Զ���ʾtip��Ĭ��Ϊfalse*/
			isOnloadShow:false,
			
			/*ҳ�������ɺ���ʾtip��ʱ��*/
			onloadHold:-1,
			
			/*��tip��ʾ�����ҳ��ʱ���Ƿ���Ŀ��Ԫ�صķ�������ʾ������tip��ʾ��Ŀ��Ԫ���Ϸ��������ʱ���Զ���ʾ��Ŀ��Ԫ�ص��·���*/
			overflowChange:true,
			
			/*�Ƿ��Զ����أ�Ĭ��true��������������document����Ԫ�ص��ʱ��tip����ʧ��*/
			isAutoHide:true,
			
			/*��ʾtip�Ĵ����¼�*/
			showListener:'mouseenter',
			
			/*����tip�Ĵ����¼�*/
			hideListener:'mouseleave',
			
			/*������tip��ʾ֮ǰ���Զ��崦������������falseʱ������ֹtip����ʾ��Ĭ��Ϊ�շ���*/
			beforeShow:$.noop,
			
			classPrefix:'fui-tip'
		},
		/**
		 * ����ڲ��¼�������events�����ж���(Ҳ��ͨ��bindEvent��̬����¼�) 
		 * ���е�{options.classPrefix}����widget�����Զ����Ϊoption��ָ����className
		*/
		events:{
			'':{
				'mouseenter':onTipEnter,
				'mouseleave':onTipLeave,
				'{options.hideListener}':'hide'
			},
			'.{options.classPrefix}-closeButton':{
				'click':onCloseBtnClick
			}
		},
		/**
		 * widget�������ں�������Ҫ��������߼�ʵ��
		 * nodeΪ����ĸ�����
		*/
		_create: function(){
			this.get('el').css('display','none');
			this.isHide = true;
			
			this.render();
			initState.call(this);
			
			bindTargetEvent.call(this);
			if(this.get('isAutoHide')){
				bindAutoHideEvent.call(this);
			}
		},
		show:function(){
			abortHide.call(this);
			if(this.showing){
				this.onShow = "show";
				return;
			}
			if(this.hiding){
				this.onHide = 'show';
				return;
			}
			if(this.get('beforeShow').call(this) !== false){
				showTip.call(this);
			}
		},
		hide:function(){
			if(this.hideTimeoutId){
				return;
			}
			if(this.showing){
				this.onShow = "hide";
				return;
			}
			if(this.hiding){
				this.onHide = 'hide';
				return;
			}
			var self = this;
			this.hideTimeoutId = setTimeout(function(){
				delete self.hideTimeoutId;
				hideTip.call(self);
			},this.get('hideDelay'))
			
		},
		handleTpl:function(){
			var data = {};
			data.classPrefix = this.get('classPrefix');
			data.isRoundedCorner = this.get('isRoundedCorner');
			data.hasCloseButton = this.get('hasCloseButton');
			data.content = this.get('content');
			processArrow.call(this,this.get('local'));
			if(this.arrowNum === 0){
				data.arrowType = '';
			} else{
				data.arrowType = this.get('classPrefix') + '-arrow-' + this.arrowPosition;
			}
			TplHandler.process.call(this,data);
		},
		getCurrentTarget:function(){
			//��options.targetָ��Ϊ���Ԫ��ʱ����δָ����ǰԪ�أ���ȡtarget�ĵ�һ��Ԫ��Ϊ��ǰԪ��
			if(!this.currentTarget){
				this.setCurrentTarget($(this.get('target'))[0]);
			}
			return this.currentTarget;
		},
		setCurrentTarget:function(o){
			this.currentTarget = o;
			return this;
		},
		setContent:function(html){
			var prefix = this.get('classPrefix');
			this.get('el').find('.' + prefix + '-content').html(html);
			return this;
		},
		setLocal:function(local){
			this.set('local',local);
			return this;
		},
		setArrow:function(arrow){
			this.set('arrow',arrow);
			return this;
		},
		setWidth:function(w){
			this.set('width',w);
			this.get('el').css('width',w);
			return this;
		},
		setDLeft:function(l){
			this.set('dLeft',l);
			return this;
		},
		setDTop:function(t){
			this.set('dTop',t);
			return this;
		},
		/**
		 * ����ģ�����  ע�⣺������������tmpl
		 * widget������Զ���{classPrefix}�滻��ʵ�ʵ�className
		 */
		tpl:[
			'<div class="<%= classPrefix %><% if(isRoundedCorner === true){ %> <%= classPrefix %>-rounded-corner<% } %>">',
				'<% if(isRoundedCorner === true){ %>',
					'<div class="<%= classPrefix %>-top">',
						'<div class="<%= classPrefix %>-top-1"></div>',
						'<div class="<%= classPrefix %>-top-2"></div>',
						'<div class="<%= classPrefix %>-top-3"></div>',
					'</div>',
				'<% } %>',
				'<div class="<%= classPrefix %>-center<% if(hasCloseButton === true){ %> <%= classPrefix %>-close<% } %>" >',
					'<% if(hasCloseButton === true){ %>',
						'<a href="#" class="<%= classPrefix %>-closeButton"></a>',
					'<% } %>',
					'<div class="<%= classPrefix %>-content"><%= content %></div>',
				'</div>',
				'<% if(isRoundedCorner === true){ %>',
					'<div class="<%= classPrefix %>-bottom">',
						'<div class="<%= classPrefix %>-bottom-3"></div>',
						'<div class="<%= classPrefix %>-bottom-2"></div>',
						'<div class="<%= classPrefix %>-bottom-1"></div>',
					'</div>',
				'<% } %>',
				'<div class="<%= classPrefix %>-arrow <%= arrowType %>">',
					'<i class="<%= classPrefix %>-arrow-1"></i>',
					'<i class="<%= classPrefix %>-arrow-2"></i>',
					'<i class="<%= classPrefix %>-arrow-3"></i>',
					'<i class="<%= classPrefix %>-arrow-4"></i>',
					'<i class="<%= classPrefix %>-arrow-5"></i>',
					'<i class="<%= classPrefix %>-arrow-6"></i>',
					'<i class="<%= classPrefix %>-arrow-7"></i>',
				'</div>',
			'</div>'
		].join(''),
		end:0
		
	});
	function initState(){
		if(this.get('isOnloadShow')){
			this.show();
			var self = this;
			if(this.get('onloadHold') !== -1){
				this.hideTimeoutId = setTimeout(function(){
					delete self.hideTimeoutId;
					hideTip.call(self);
				},this.get('onloadHold'));
			}
			
		}
		if(this.get('width') !== -1){
			this.get('el').css('width',this.get('width'));
		}
	}
	function abortHide(){
		if(this.hideTimeoutId){
			clearTimeout(this.hideTimeoutId);
			delete this.hideTimeoutId;
		}
	}
	function hideTip(){
		if(this.isHide) return;
		this.isHide = true;
		var animateTime = 0;
		if(this.get('isAnim')){
			animateTime = this.get('animTime');
		}
		this.hiding = true;
		var self = this;
		this.get('el').hide(animateTime,function(){
			delete self.hiding;
			if(self.onHide){
				self[self.onHide]();
			}
			delete self.onHide;
		});
	}
	function showTip(){
		
		fixPosition.call(this,this.get('local'));
		if(this.get('overflowChange')){
			 inverseDirection.call(this);
		}
		this.get('el').css({	
			"top":this.y,
			"left":this.x
		});
		var animateTime = 0;
		if(this.get('isAnim')){
			animateTime = this.get('animTime');
		}
		this.showing = true;
		delete this.isHide;
		var self = this;
		
		this.get('el').show(animateTime,function(){
			self.get('el').css('overflow','visible');
			delete self.showing;
			if(self.onShow){
				self[self.onShow]();
			}
			delete self.onShow;
		});
	}
	function inverseDirection(){
		var t = this, wW = 0, wH = 0, sW = 0, sH = 0, dX = 0, dY = 0, _x = 0, x_ = 0, _y = 0, y_ = 0,
			d = null, w = $(this.getCurrentTarget()).outerWidth(), h = $(this.getCurrentTarget()).outerHeight(),
			tipH = this.get('el').outerHeight(),tipW = this.get('el').outerWidth(),local = t.get('local');

		d = document.documentElement;
		wW = d.clientWidth;
		wH = d.clientHeight;
		sW = $(document).scrollLeft();
		sH = $(document).scrollTop();

		dY = sH > t.y ? 1 : (sH + wH < t.y + h + tipH ? 2 : 0);
		dX = sW > t.x ? 6 : (sW + wW < t.x + w + tipW ? 3 : 0);

		_x = t.targetX - sW;
		x_ = sW + wW - t.targetX - w;
		_y = t.targetY - sH;
		y_ = sH + wH - t.targetY - h;

		if (t.get('local') > 0 && t.get('local') < 5) {
			if (dY == 1 && y_ > _y) {
				local = t.get('local') == 1 ? 3 : (t.get('local') == 2 ? 4 : t.get('local'));
			} else if (dY == 2 && _y > y_) {
				local = t.get('local') == 3 ? 1 : (t.get('local') == 4 ? 2 : t.get('local'));
			}
		} else if (t.get('local') > 4 && t.get('local') < 9) {
			if (dX == 6 && x_ > _x) {
				local = t.get('local') == 5 ? 7 : (t.get('local') == 6 ? 8 : t.get('local'));
			} else if (dX == 3 && _x > x_) {
				local = t.get('local') == 7 ? 5 : (t.get('local') == 8 ? 6 : t.get('local'));
			}
		}

		processArrow.call(this,local);
		var prefix = this.get('classPrefix');
		if(t.arrowNum === 0){
			this.get('el').find('.' + prefix + '-arrow').attr("class",prefix + '-arrow');
		} else {
			this.get('el').find('.' + prefix + '-arrow').attr("class",prefix + '-arrow ' + prefix + '-arrow-' + t.arrowPosition);
		}
		
		
		fixPosition.call(this, local);

		return local;
	}
	function fixPosition(local){
		var targetX = 0, targetY = 0, tipX = 0, tipY = 0,cornerHeight = 0,target = this.getCurrentTarget(),
		    targetW = $(target).outerWidth(), targetH = $(target).outerHeight(),
			tipW = this.get('el').outerWidth(),tipH = this.get('el').outerHeight();	
			
		if(this.get('isRoundedCorner')){
			cornerHeight = 3;
		}
		/* ��ȡtargetԪ�ص�����ֵ */
		this.targetX = targetX = $(target).offset().left;
		this.targetY = targetY = $(target).offset().top;
		
		switch (local) {
			case 1:
				tipX = targetX;
				tipY = targetY - tipH - 6;
				break;
			case 2:
				tipX = targetX + targetW - tipW;
				tipY = targetY - tipH - 6;
				break;
			case 3:
				tipX = targetX;
				tipY = targetY + targetH + 6;
				break;
			case 4:
				tipX = targetX + targetW - tipW;
				tipY = targetY + targetH + 6;
				break;
			case 5:
				tipX = targetX - tipW - 6;
				tipY = targetY - cornerHeight;
				break;
			case 6:
				tipX = targetX - tipW - 6;
				tipY = targetY + targetH - tipH + cornerHeight;
				break;
			case 7:
				tipX = targetX + targetW + 6;
				tipY = targetY - cornerHeight;
				break;
			case 8:
				tipX = targetX + targetW + 6;
				tipY = targetY + targetH - tipH + cornerHeight;
				break;
		}

		/* ������ƫ��ֵ */
		tipX -= this.get('dLeft');
		tipY -= this.get('dTop');
		
		this.x = tipX;
		this.y = tipY;
	}
	function onCloseBtnClick(e){
		var self = this;
		//���IE�µ��ص���������ʾ��ʱ�����ٴδ���mouseenter�¼���BUG
		setTimeout(function(){
			if(self.get('onCloseButtonClick').call(self) !== false){
				self.hide();
			}
		},0);
	}	
	function onTipEnter(e){
		this.tipEnter = true;
		if(this.get('isHoverHold')){
			abortHide.call(this);
		}
	}
	function onTipLeave(e){
		delete this.tipEnter;
	}
	function bindAutoHideEvent(){
		var self = this;
		$(window).resize(function(){
			self.hide();
		}).scroll(function(){
			self.hide();
		});
		
		$(document).on("click",function(e){
			if(	self.enteredTarget && self.getCurrentTarget() && self.enteredTarget === self.getCurrentTarget()){
				return;
			}
			if(self.tipEnter) return;
			self.hide();
		})
	}
	function bindTargetEvent(){
		var showEvent = this.get('showListener');
		var hideEvent = this.get('hideListener');
		var target = this.get('target');
		var self = this;
		//��¼�Ƿ�hover targetԪ�ص�״̬
		$(document).on('mouseenter',target,function(e){
			self.enteredTarget = e.target;
		});
		$(document).on('mouseleave',target,function(e){
			delete self.enteredTarget;
		});
		if(showEvent){
			$(document).on(showEvent,target,function(e){
				self.setCurrentTarget(e.target);
				self.show();
			});
		}
		if(hideEvent){
			$(document).on(hideEvent,target,function(e){
				if(self.getCurrentTarget() === e.target){
					self.hide();
				}
			});
		}
	}
	/**
	* ����ͷ����ΪĬ��ʱ���ü�ͷ����
	* @param {int} local ���������λ��
	* @return {null}
	* @author Aissa 2010-1-19
	*/
	function processArrow(local) {
		
		var arrow = this.get('arrow');
		if (arrow != 9) 
		{
			this.arrowNum = arrow;
			convertToPosByNum.call(this);
			return;
		}
		switch (local) {
			case 1:
				this.arrowNum = 3;
				break;
			case 2:
				this.arrowNum = 4;
				break;
			case 3:
				this.arrowNum = 1;
				break;
			case 4:
				this.arrowNum = 2;
				break;
			case 5:
				this.arrowNum = 7;
				break;
			case 6:
				this.arrowNum = 8;
				break;
			case 7:
				this.arrowNum = 5;
				break;
			case 8:
				this.arrowNum = 6;
				break;
		}
		convertToPosByNum.call(this);
	}
	function convertToPosByNum(){
		switch (this.arrowNum) {
			case 1:
				this.arrowPosition = 't-l';
				break;
			case 2:
				this.arrowPosition = 't-r';
				break;
			case 3:
				this.arrowPosition = 'b-l';
				break;
			case 4:
				this.arrowPosition = 'b-r';
				break;
			case 5:
				this.arrowPosition = 'l-t';
				break;
			case 6:
				this.arrowPosition = 'l-b';
				break;
			case 7:
				this.arrowPosition = 'r-t';
				break;
			case 8:
				this.arrowPosition = 'r-b';
				break;
		}
	}
		
	return Tip;
} );
