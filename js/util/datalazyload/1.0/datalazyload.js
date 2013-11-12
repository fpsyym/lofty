/*!!cmd:compress=true*/
/*!!cmd:jsCompressOpt=["--disable-optimizations"]*/

/**
 * @module lofty/util/datalazyload
 * @author chuanpeng.qchp
 * @date 20130902
 * 
 */
  
define( 'lofty/util/datalazyload/1.0/datalazyload', ['lofty/lang/class', 
													 'lofty/lang/base', 
													 'jquery'], 
	function(Class, Base,$){
	'use strict';
	var WIN = window, DOC = document, 
		IMGSRCNAME = 'data-lazyload-src', 
		TEXTAREACLASSNAME = 'lazyload-textarea';
	var DataLazyload = Class( Base,{
		options: {
			container: {
				value: 'body',
				getter: function(s) {
					if ('string' === typeof s) {
						s = $(s);
					}
					return s;
				}
			},
			autoLoad:true,
			threshold:200
		},
		
		init:function (config){
			//this.options = $.extend(true, {},this.options);
			Base.prototype.init.call(this, config || {});
			if(this.get('autoLoad')){
				bindExposureEvent.call(this);
			}
		},
		pause:function(){
			unBindExposureEvent.call(this);
		},
		isPause:function(){
			return !this.hasBindEvent;
		},
		start:function(){
			bindExposureEvent.call(this);
		},
		addCallBack:function(selector,callback){
			if(callback === undefined && $.isPlainObject(selector)){
				for(var each in selector){
					if($.isFunction(selector[each])){
						this.addCallBack(each,selector[each]);
					}
				}
				return;
			}
			if(!this.callBackSource){
				this.callBackSource = {};
			}
			if(this.callBackSource[selector]){
				this.callBackSource[selector].push(callback);
			} else{
				this.callBackSource[selector] = [callback];
			}
		}
	});
	
	function collect(container){
		if(!this.imgs){
			this.imgs = [];
		}
		if(!this.textareas){
			this.textareas = [];
		}
		
		for(var i=0,j=container.length;i<j;i++){
			
			
			if($(container[i]).hasClass(TEXTAREACLASSNAME)){
				this.textareas.push(container[i])
			}else {
				//先缓存具有回调方法的元素
				cachecallbackEls.call(this,container[i]);
				if($(container[i]).attr(IMGSRCNAME)){
					this.imgs.push(container[i]);
				} 
				var tempImgs = $('img[' + IMGSRCNAME + ']', $(container[i])).toArray();
				for(var tmpImgI = 0,imgLen = tempImgs.length;tmpImgI<imgLen;tmpImgI++){
					this.imgs.push(tempImgs[tmpImgI]);
				}
				var tempAreas = $('.' + TEXTAREACLASSNAME, $(container[i])).toArray();
				for(var tmpAreaI = 0,areaLen = tempAreas.length;tmpAreaI<areaLen;tmpAreaI++){
					this.textareas.push(tempAreas[tmpAreaI]);
				}
			}
		}
	}
	
	function loadExposedSource(){
		var currentScrollTop = $(document).scrollTop(), 
		    viewportHeight = $(window).height();
		loadTextarea.call(this,currentScrollTop,viewportHeight);
		loadImg.call(this,currentScrollTop,viewportHeight);
		exposeCallBack.call(this,currentScrollTop,viewportHeight)
		if((!this.callbackEls || this.callbackEls.length===0) && 
		    (!this.textareas || this.textareas.length === 0) && 
			(!this.imgs || this.imgs.length ===0)){
			unBindExposureEvent.call(this);
		}
	}
	function exposeCallBack(scrollTop,windowH){
		if(!this.callbackEls) return;
		for(var i=0;i<this.callbackEls.length;){
			if(hasExposed.call(this,this.callbackEls[i].element,scrollTop,windowH)){
				var callbacks = this.callbackEls[i].callBacks;
				for(var m=0,n=callbacks.length;m<n;m++){
					callbacks[m]();
				}
				this.callbackEls.splice(i, 1);
			} else{
				i++;
			}
		}
	}
	function cachecallbackEls(container){
		if(!this.callBackSource){
			return;
		}
		if(!this.callbackEls){
			this.callbackEls = [];
		}
		for(var selector in this.callBackSource){
			if($(selector).index(container) !== -1){
				addCallbackTo.call(this,container,selector)
			}
			var sons = $(selector,$(container)).toArray();
			for(var i=0,len=sons.length;i<len;i++ ){
				addCallbackTo.call(this,sons[i],selector);
			}
		}
	}
	function addCallbackTo(el,selector){
		for(var i=0,j=this.callbackEls.length;i<j;i++){
			if(this.callbackEls[i].element === el){
				for(var m=0,n=this.callBackSource[selector].length;m<n;m++){
					this.callbackEls[i].callBacks.push(this.callBackSource[selector][m]);
				}
				return;
			}
		}
		this.callbackEls.push({
			element:el,
			callBacks:this.callBackSource[selector].slice(0)
		});
	}
	function hasExposed(item,scrollTop,winH){
		var benchmark = scrollTop + winH + this.get('threshold'), 
		   itemOffsetTop = $(item).offset().top,
		   itemHeight = $(item).outerHeight();
		if (itemOffsetTop <= benchmark && (itemOffsetTop + itemHeight + this.get('threshold')) > scrollTop) {
			return true;
		}
		return false;
	}

	function loadTextarea(scrollTop,windowH){
		for(var i = 0;i<this.textareas.length;){
			if(hasExposed.call(this,this.textareas[i],scrollTop,windowH)){
				var html = $(this.textareas[i]).val();
				var $elements = $(html);
				$elements.insertAfter($(this.textareas[i]));
				$(this.textareas[i]).remove();
				this.textareas.splice(i, 1);
				collect.call(this,$elements);
			}else{
				i++;
			}
			
		}
	}
	function loadImg(scrollTop,windowH){
		for(var i = 0;i<this.imgs.length;){
			if(hasExposed.call(this,this.imgs[i],scrollTop,windowH)){
				
				var src,el = $(this.imgs[i]);
				src = el.attr(IMGSRCNAME);
				if (src) {
					el.one('load', function(){
						$(this).css('zoom', 1);
					});
					el.attr('src', src);
					el.removeAttr(IMGSRCNAME);
					this.imgs.splice(i, 1);
				}
			} else{
				i++;
			}
		}
	}

	function bindExposureEvent(){
		//绑定滚动事件
		if(!this.hasInit){
			collect.call(this,this.get('container'));
			this.hasInit = true;
		}
		loadExposedSource.call(this);
		if(this.hasBindEvent){ 
			return;
		}
		var self = this;
		$(window).on("scroll._dataLazyLoad" + getCurrentGuid.call(this),function(){
			if(self.scrollTimeoutId){
				clearTimeout(self.scrollTimeoutId);
			}
			self.scrollTimeoutId = setTimeout(function(){
				loadExposedSource.call(self);
			},100);
		});
		$(window).on("resize._dataLazyLoad" + getCurrentGuid.call(this),function(){
			if(self.resizeTimeoutId){
				clearTimeout(self.resizeTimeoutId);
			}
			self.resizeTimeoutId = setTimeout(function(){
				loadExposedSource.call(self);
			},100);
		});
		this.hasBindEvent = true;
	}
	function unBindExposureEvent(){
		if(this.hasBindEvent){
			if(this.scrollTimeoutId){
				clearTimeout(this.scrollTimeoutId);
			}
			if(this.resizeTimeoutId){
				clearTimeout(this.resizeTimeoutId);
			}
			$(window).off("scroll._dataLazyLoad" + getCurrentGuid.call(this));
			$(window).off("resize._dataLazyLoad" + getCurrentGuid.call(this));
			this.hasBindEvent = false;
		}
	}
	var  lazyCount = 1;
	function Guid(){
		return lazyCount++;
	}
	function getCurrentGuid(){
		if(!this.guid){
			this.guid = Guid();
		}
		return this.guid;
	}
	return DataLazyload;
  
  });
  
    	