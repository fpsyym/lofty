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
			/* 目标元素	*/
			target:"",
			
			/* 是否圆角 --*/
			isRoundedCorner:true,   
			
			/* 是否有关闭按钮 */
			hasCloseButton:false,
			
			/* 当有关闭按钮时,点击关闭按钮时回调的业务的方法*/
			onCloseButtonClick:$.noop, 
			
			/* 内容 */
			content:'',		
			
			/* tips 浮动的相对位置 1:top left 2:top right 3:bottom left 4:bottom right 5:left top 6:left bottom 7:right top 8:right bottom -- */
			local: 1,  

			/* tips的arrow相对位置 0:null 1:top left 2:top right 3:bottom left 4:bottom right 5:left top 6:left bottom 7:right top 8:right bottom 9:default -- */
			arrow: 9,
			
			/*宽度 默认为-1代表由外部CSS指定*/
			width:-1,
			
			/*向左微调*/
			dLeft:0,
			
			/*向上微调*/
			dTop:0,
			
			/*在显示和隐藏的时候是否有动画效果，默认为true*/
			isAnim:true,
			
			animTime:50,
			
			/*鼠标经过tip提示框时，提示框是否保持显示状态，默认为true*/
			isHoverHold:true,
			
			/*当需要隐藏tip时，设置隐藏的延迟时间，单位毫秒，默认为200毫秒，当设置为0时，不延迟*/
			hideDelay:200,
			
			/*页面加载完成，是否自动显示tip，默认为false*/
			isOnloadShow:false,
			
			/*页面加载完成后显示tip的时间*/
			onloadHold:-1,
			
			/*当tip提示框溢出页面时，是否在目标元素的反方向显示（例：tip显示在目标元素上方，当溢出时，自动显示在目标元素的下方）*/
			overflowChange:true,
			
			/*是否自动隐藏，默认true（滚动条滚动，document其他元素点击时，tip会消失）*/
			isAutoHide:true,
			
			/*显示tip的触发事件*/
			showListener:'mouseenter',
			
			/*隐藏tip的触发事件*/
			hideListener:'mouseleave',
			
			/*设置在tip显示之前的自定义处理，当方法返回false时，将阻止tip框显示，默认为空方法*/
			beforeShow:$.noop,
			
			classPrefix:'fui-tip'
		},
		/**
		 * 组件内部事件集中在events变量中定义(也可通过bindEvent动态添加事件) 
		 * 其中的{options.classPrefix}会由widget基类自动替代为option中指定的className
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
		 * widget子类的入口函数，需要根据组件逻辑实现
		 * node为组件的父容器
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
			//当options.target指定为多个元素时，而未指定当前元素，则取target的第一个元素为当前元素
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
		 * 定义模板变量  注意：变量名必须是tmpl
		 * widget基类会自动将{classPrefix}替换成实际的className
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
		/* 获取target元素的坐标值 */
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

		/* 绑定坐标偏差值 */
		tipX -= this.get('dLeft');
		tipY -= this.get('dTop');
		
		this.x = tipX;
		this.y = tipY;
	}
	function onCloseBtnClick(e){
		var self = this;
		//解决IE下当回调方法有提示框时，会再次触发mouseenter事件的BUG
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
		//记录是否hover target元素的状态
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
	* 当箭头配置为默认时设置箭头方向
	* @param {int} local 浮动的相对位置
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
