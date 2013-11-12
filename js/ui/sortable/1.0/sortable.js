/*!!cmd:compress=true*/
/*!!cmd:jsCompressOpt=["--disable-optimizations"]*/

/**
 * @module lofty/ui/sortable
 * @author terence.wangt
 * @from modify from fdev4 portlets
 * @date 20130902
 * 
 */
 
define('lofty/ui/sortable/1.0/sortable', ['lofty/lang/class', 'lofty/ui/sortable/1.0/mouse', 'jquery'], 

	function(Class, Mouse, $){
	'use strict';
	
	var sortable = Class( Mouse, {

		options: {
            axis: false,							// 如果被定义了，则选项只能被水平或者垂直托动,可选的值："x","y"
            orientation: 'vertical',				// 该配置的作用是辅助排序算法，指定模块的排序方向。当出现模块全部位于水平时需要使用"horizontal"
            handle: false,							// 限制排序的动作只能在item元素的某个元素开始
            items: '> *',							// 该配置为选择器，提供排序模块的节点条件。
            modal: true,							 
			helper: 'original',						// 设置是否在拖拽元素时，显示一个辅助的元素。可选值： 'original','clone'
			appendTo: 'parent',						// 指定helper追加在哪个元素后面
			opacity: false,							// 0 - 1 之间的数值，设置"helper"的透明度
            placeholder: false,						// 设置当排序动作发生时，空白占位符的CSS样式
            dropOnEmpty: true,						// 当"columns"有多个的情况下，出现某个"column"中没有"item"，是否允许从其他"column"拖拽"item"到空的"column"内
            scroll: true,							// 拖拽过程中是否进行智能滚屏
            scrollSensitivity: 20,					// 设置当元素移动至边缘多少像素时，便开始滚动页面
            scrollSpeed: 20,						// 设置页面的滚动速度
            revert: false,							// 拖拽结束，释放鼠标后，"helper"到"placeholder"的一个动画效果的时长(毫秒)
            revertOuter: false,						 
            zIndex: 1000,							// 拖拽时"helper"的"z-index"样式属性
			classPrefix:'fui'						// 默认的class前缀
        },
		
        _create: function(){
		
            this.columns = [];
            this.items = [];
            this.position = {};
			this.prefix	= this.get('classPrefix');
			this.get('el').addClass(this.prefix + '-sortable');
			
            this.mouseInit();
        },
        
		/**
		 * 销毁组件（destroy）时候调用
		 * @protected
		 */
        destroy: function(){
            this.get('el').removeClass(this.prefix + '-sortable ' + this.prefix + '-sortable-disabled');
            this.mouseDestroy();
			this.constructor.superclass.destory.call(this);
        },
        
		/**
		 * 覆盖mouse类的 mouseCapture方法
		 * @private
		 */
        mouseCapture: function(e){
            var currentItem;
            //跳出 组件禁用/动画
            if (this.get('disabled') || this.reverting) {
                return false;
            }
            
            //refresh Columns & Items
            refreshItems.call(this);
            //Find out if the clicked node (or one of its parents) is a actual item in this.items
            $(e.target).parents().andSelf().each(function(){
                if ($.data(this, 'sortable-item') === true) {
                    currentItem = $(this);
                    return false;
                }
            });
            
            if (!currentItem) {
                return false;
            }
            
            if (this.get('handle')) {
                //check if click in handler area
                var validHandle = false;
                //遍历handler中的元素，判断是否为e.target
                $(this.get('handle'), currentItem).find('*').andSelf().each(function(){
                    if (this === e.target) {
                        validHandle = true;
                        return false;
                    }
                });
                
                if (!validHandle) {
                    return validHandle;
                }
            }
            //Call callbacks
            this.trigger('capture', {
                currentItem: currentItem
            }, e);
            
            this.currentItem = currentItem;

            return true;
        },
        
		/**
		 * 覆盖mouse类的 mouseStart方法
		 * @private
		 */
        mouseStart: function(e){
             //noformat
            var elem = this.get('el'),
				currentItem = this.currentItem, 
				currentItemCache = (this.currentItemCache = this.currentItem.offset()), 
				helper, 
				offsetParent = currentItem.offsetParent().offset(),
				placeholder;
            //format
            $.extend(currentItemCache, {
                //Where the click happened, relative to the element
                click: {
                    left: e.pageX - currentItemCache.left,
                    top: e.pageY - currentItemCache.top
                },
                offset: offsetParent,
                width: currentItem.width(),
                height: currentItem.height()
            });
            //1.先初始化占位符
            placeholder = (this.placeholder = createPlaceholder.call(this, e));
            
            //2.再初始化helper
            helper = (this.helper = createHelper.call(this, e));
            
            //修正鼠标到currentItem左上角的坐标
            if (this.get('cursorAt')) {
                adjustOffsetFromHelper.call(this, this.get('cursorAt'));
            }
            
            if (this.get('opacity')) { // opacity option
                helper.css('opacity', this.get('opacity'));
            }
            
            if (this.get('zIndex')) { // zIndex option
                helper.css('zIndex', this.get('zIndex'));
            }
            
            if (this.get('scroll')) {
                //Get the next scrolling parent
                this.scrollParent = scrollParent(helper);
                if (this.scrollParent[0] !== document && this.scrollParent[0].tagName !== 'HTML') {
                    this.scrollParentCache = this.scrollParent.offset();
                }
            }
            
            if (this.get('modal')) {
                var elemOffset = elem.offset();
                elem.prepend(this.modal = $('<div>', {
                    css: {
                        left: elemOffset.left - currentItemCache.offset.left,
                        top: elemOffset.top - currentItemCache.offset.top,
                        position: 'absolute',
                        zIndex: this.get('zIndex') - 1,
                        backgroundColor: '#FFF',
                        opacity: 0
                    }
                }));
            }
            else {
                //阻止文字选中
                disableSelection($(document), this.prefix);
            }
            
            //get currentColumn
            getCurrentColumn.call(this);
            this.originalColumn = this.currentColumn;
            
            this.dragging = true;
            //Call callbacks
            this.trigger('start', createUiHash.call(this), e);
            //start可能会改变结构，在这里刷新坐标属性
            refreshPositions.call(this);
            
            return true;
        },
        
		/**
		 * 覆盖mouse类的 mouseDrag方法
		 * @private
		 */
        mouseDrag: function(e){
            //noformat
            var columns = this.columns, 
				items = this.items,
				helper = this.helper, 
				currentItemCache = this.currentItemCache,
				position = this.position,
                currentColumn = this.currentColumn,
				scrollParent = this.scrollParent,
				scrollParentCache = this.scrollParentCache,
				isVertical = this.get('orientation') === 'vertical',
				scrollSpeed = this.get('scrollSpeed'),
				scrollSensitivity = this.get('scrollSensitivity'),
				target,
				direction, 
                min = Number.MAX_VALUE;
			//format
            //Do scrolling
            if (this.get('scroll')) {
                if (scrollParent[0] !== document && scrollParent[0].tagName !== 'HTML') {
                
                    if ((scrollParentCache.top + scrollParent[0].offsetHeight) - e.pageY < scrollSensitivity) {
                        scrollParent[0].scrollTop = scrollParent[0].scrollTop + scrollSpeed;
                    }
                    else if (e.pageY - scrollParentCache.top < scrollSensitivity) {
                        scrollParent[0].scrollTop = scrollParent[0].scrollTop - scrollSpeed;
                    }
                    
                    if ((scrollParentCache.left + scrollParent[0].offsetWidth) - e.pageX < scrollSensitivity) {
                        scrollParent[0].scrollLeft = scrollParent[0].scrollLeft + scrollSpeed;
                    }
                    else if (e.pageX - scrollParentCache.left < scrollSensitivity) {
                        scrollParent[0].scrollLeft = scrollParent[0].scrollLeft - scrollSpeed;
                    }
                }
                else {
                
                    if (e.pageY - $(document).scrollTop() < scrollSensitivity) {
                        $(document).scrollTop($(document).scrollTop() - scrollSpeed);
                    }
                    else if ($(window).height() - (e.pageY - $(document).scrollTop()) < scrollSensitivity) {
                        $(document).scrollTop($(document).scrollTop() + scrollSpeed);
                    }
                    if (e.pageX - $(document).scrollLeft() < scrollSensitivity) {
                        $(document).scrollLeft($(document).scrollLeft() - scrollSpeed);
                    }
                    else if ($(window).width() - (e.pageX - $(document).scrollLeft()) < scrollSensitivity) {
                        $(document).scrollLeft($(document).scrollLeft() + scrollSpeed);
                    }
                }
            }
            
            //Compute the helpers position
            $.extend(this.position, {
                left: e.pageX - currentItemCache.click.left - currentItemCache.offset.left,
                top: e.pageY - currentItemCache.click.top - currentItemCache.offset.top
            });
            
            //Set the helper position
            if (!this.get('axis') || this.get('axis') != 'y') {
                helper[0].style.left = position.left + 'px';
            }
            if (!this.get('axis') || this.get('axis') != 'x') {
                helper[0].style.top = position.top + 'px';
            }
            
            
            for (var i = columns.length - 1; i > -1; i--) {
                var column = columns[i], inColumn;
                //判断是否在“Column”的区域内
                if (isVertical) {
                    inColumn = column.left <= e.pageX && e.pageX <= column.left + column.width;
                }
                else {
                    inColumn = column.top <= e.pageY && e.pageY <= column.top + column.height;
                }
                //在某一Column中
                if (inColumn) {
                    target = column.dom;
                    //切换Column
                    if (currentColumn[0] !== target) {
                        currentColumn = this.currentColumn = $(target);
                        this.trigger('over', createUiHash.call(this), e);
                    }
                    //Column不接收Item
                    if (currentColumn.hasClass( this.prefix + '-sortable-unreceivable')) {
                        return;
                    }
                    //Init Column边界值
                    var minEdge = Number.MAX_VALUE, maxEdge = Number.MIN_VALUE;
                    
                    for (var j = items.length - 1; j > -1; j--) {
                        var item = items[j];
                        //排除当前项
                        if (item.dom && item.dom === this.currentItem[0]) {
                            continue;
                        }
                        //排除不属于当前Column的item
                        if (!$.contains(currentColumn[0], item.dom)) {
                            continue;
                        }
                        //是否在某Item区域内
                        var distances, bOver = isOver(e.pageY, e.pageX, item.top, item.left, item.height, item.width);
                        //重置Column的边界
                        minEdge = Math.min(isVertical ? item.top : item.left, minEdge);
                        maxEdge = Math.max(isVertical ? item.top + item.height : item.left + item.width, maxEdge);
                        if (bOver) {
                            target = item.dom;
                            //计算鼠标到当前Item的四个角的距离
                            distances = [measure(e, {
                                left: item.left,
                                top: item.top
                            }), measure(e, {
                                left: item.left,
                                top: item.top + item.height
                            }), measure(e, {
                                left: item.left + item.width,
                                top: item.top
                            }), measure(e, {
                                left: item.left + item.width,
                                top: item.top + item.height
                            })];
                            //获取最小距离从而确定placeholder插入的位置
                            $.each(distances, function(i, distance){
                                if (distance < min) {
                                    min = distance;
                                    if (isVertical) {
                                        direction = i % 2 ? 'after' : 'before';
                                    }
                                    else {
                                        direction = i > 1 ? 'after' : 'before';
                                    }
                                }
                            });
                        }
                    }
                    //假如鼠标不在任何Item上方（排除当前项），则判断鼠标位于Column的上方还是下方
                    if (!direction) {
                        //如果小于边界
                        if ((isVertical ? e.pageY : e.pageX) < minEdge) {
                            direction = 'prepend';
                        }
                        //如果大于边界或者Column内没有Item
                        else if ((isVertical ? e.pageY : e.pageX) > maxEdge || maxEdge < 0) {
                            direction = 'append'
                        }
                    }
                    break;
                }
            }
            //如果在某Column区域内 且有direction
            if (target && direction) {
                //位置没有改变
                if (target === position.dom && direction === position.direction) {
                    return;
                }
                position.dom = target;
                position.direction = direction;
                var hasChanged = true;
                switch (direction) {
                    case 'append':
                        var lastItem = $(this.get('items') + ':not(.'+ this.prefix +'-sortable-helper):last', target);
                        if (lastItem[0] === this.placeholder[0]) {
                            hasChanged = false;
                            break;
                        }
                        if (lastItem.length) {
                            target = lastItem;
                            direction = 'after';
                        }
                        break;
                    case 'prepend':
                        var firstItem = $(this.get('items') + ':not(.'+ this.prefix +'-sortable-helper):first', target);
                        if (firstItem[0] === this.placeholder[0]) {
                            hasChanged = false;
                            break;
                        }
                        if (firstItem.length) {
                            target = firstItem;
                            direction = 'before';
                        }
                        break;
                    case 'before':
                        var prevItem = $(target).prev();
                        while (prevItem.length && prevItem.hasClass(this.prefix +'-sortable-helper')) {
                            prevItem = prevItem.prev();
                        }
                        if (prevItem[0] === this.placeholder[0]) {
                            hasChanged = false;
                        }
                        break;
                    case 'after':
                        var nextItem = $(target).next();
                        while (nextItem.length && nextItem.hasClass(this.prefix +'-sortable-helper')) {
                            nextItem = nextItem.next();
                        }
                        if (nextItem[0] === this.placeholder[0]) {
                            hasChanged = false;
                        }
                        break;
                }
                if (hasChanged) {
                    //触发change事件，事件返回false则不执行条件区域内的操作
                    if (direction === 'append' || direction === 'prepend') {
                        if ($.isFunction(this.get('dropOnEmpty'))) {
                            hasChanged = this.get('dropOnEmpty').call(this.get('el')[0], e, createUiHash.call(this));
                            //dropOnEmpty返回false 代表组织默认的change事件，于是需要refreshPositions
                            if (!hasChanged) {
								refreshPositions.call(this, true);
                            }
                        }
                        else {
                            hasChanged = this.get('dropOnEmpty');
                        }
                    }
                    if (!hasChanged) {
                        return;
                    }
                    this.trigger('change', createUiHash.call(this), e);
                    $(target)[direction](this.placeholder);
                    //刷新坐标
                    refreshPositions.call(this, true);
                }
                return;
            }
        },
        
		
		/**
		 * 覆盖mouse类的 mouseStop方法
		 * @private
		 */
        mouseStop: function(e){
            if (!e) {
                return;
            }
			
			var self = this;
            if (self.get('revert')) {
                var placeholder = self.placeholder, offset = placeholder.offset(), offsetParent = placeholder.offsetParent().offset(), rangeWidth = self.get('revertOuter')? 'outerWidth' : 'width', rangeHeight = self.get('revertOuter') ? 'outerHeight' : 'height';
                self.reverting = true;
                $(self.helper).animate({
                    top: offset.top - offsetParent.top,
                    left: offset.left - offsetParent.left,
                    width: placeholder[rangeWidth](),
                    height: placeholder[rangeHeight]()
                }, parseInt(self.get('revert'), 10) || 500, function(){
                    clear.call(self, e);
                });
            }
            else {
				clear.call(self, e);
            }
        }
	});
	
	
	
	//////////////////////////////////////////////////////////////////
	//////////////////private functions//////////////////////////////
	
	 /**
	 * 重新获得currentColumn
	 */
	function getCurrentColumn(){
		var self = this;
		$.each(self.columns, function(){
			var column = $(this.dom);
			if ($.contains(column[0], self.currentItem[0])) {
				self.currentColumn = column;
				return false;
			}
		});
	}
	
	/**
	 * 修正鼠标到item左上角距离
	 * @param {Object} obj
	 */
	function adjustOffsetFromHelper(obj){
		var self = this;
		if ('left' in obj) {
			self.currentItemCache.click.left = obj.left;
		}
		if ('top' in obj) {
			self.currentItemCache.click.top = obj.top;
		}
	}
    
	
	function clear(e){
		var self = this, currentItem = self.currentItem, helper = self.helper, placeholder = self.placeholder;
		
		self.reverting = false;
		
		if (helper[0] !== currentItem[0]) {
			helper.remove();
		}
		else {
			helper.removeClass(self.prefix +'-sortable-helper').removeAttr('style');
		}
		placeholder.after(currentItem.show()).remove();
		
		$.each(self.items, function(i){
			$(this.dom).removeData('sortable-item');
		});
		
		getCurrentColumn.call(self);
		
		self.trigger('stop', createUiHash.call(self), e);
		
		if (self.get('modal')) {
			self.modal.remove();
			delete self.modal;
		}
		else {
			//释放文字选中
			$(document).enableSelection();
		}
		$.extend(self, {
			items: [],
			columns: [],
			position: {},
			currentItem: null,
			currentItemCache: null,
			currentColumn: null,
			originalColumn: null,
			helper: null,
			placeholder: null,
			placeholderCache: null,
			scrollParent: null,
			dragging: false,
			reverting: false
		});
	}
	 /**
	 * 刷新colums和items信息
	 */
	function refreshItems(){
		var self = this, elem = self.get('el'), columns;
		//组和项信息保存
		columns = self.get('columns') ? $(self.get('columns'), elem) : elem;
		
		columns.each(function(){
			var column = $(this);
			self.columns.push({
				dom: this
			});
		});
		columns.find(self.get('items')).each(function(){
			var item = $(this);
			item.data('sortable-item', true);
			self.items.push({
				dom: this
			});
		});
	}

	 /**
	 * 刷新colums和items坐标信息
	 * @param {Object} fast
	 */
	function refreshPositions(fast){
		//noformat
		var self = this, elem = self.get('el'), currentItem = self.currentItem; 
		//format
		
		$.each(self.columns, function(){
			var columnCache = this, column = $(columnCache.dom);
			$.extend(columnCache, column.offset());
			columnCache.width = column.width();
			columnCache.height = column.height();
		});
		$.each(self.items, function(){
			var itemCache = this, item = $(itemCache.dom);
			
			$.extend(itemCache, item.offset());
			if (!fast) {
				itemCache.width = item.outerWidth();
				itemCache.height = item.outerHeight();
			}
		});
		
		if (self.get('modal')) {
			self.modal.css({
				width: elem.outerWidth(),
				height: elem.outerHeight()
			});
		}
		
		return self;
	}
	
	/**
	 * 创建浮动容器
	 * @param {Object} e
	 */
	function createHelper(e){
		//noformat
		var self = this,
			currentItem = self.currentItem, 
			currentItemCache = self.currentItemCache,
			helper = ($.isFunction(self.get('helper')) ? $(self.get('helper').call(self.widget(), e, currentItem)) : 
				currentItem.width(currentItemCache.width)
					.height(currentItemCache.height)
					.css('margin', 0))
					.addClass(self.prefix + '-sortable-helper')
					.css({
						position: 'absolute',
						//为何初始化left和top的值，IE下，不设置这个值，在最后获取helper坐标的时候有问题
						left: currentItemCache.left - currentItemCache.offset.left,
						top: currentItemCache.top - currentItemCache.offset.top
					});
		//format
		//如果不是拖动original
		if (helper[0] !== currentItem[0]) {
			currentItem.hide();
			$(self.get('appendTo') !== 'parent' ? self.get('appendTo') : currentItem[0].parentNode)[0].appendChild(helper[0]);
		}
		return helper;
	}
	
	 /**
	 * 创建占位容器
	 */
	function createPlaceholder(e){
		//noformat
		var self = this,
			currentItem = self.currentItem, 
			placeholder = $.isFunction(self.get('placeholder'))? $(self.get('placeholder').call(self.get('el')[0], e, currentItem)):
				$(document.createElement(currentItem[0].nodeName)).height(self.currentItemCache.height).addClass(self.currentItem[0].className);
		//format
		placeholder.addClass(self.prefix + '-sortable-placeholder');
		if (typeof self.get('placeholder') === 'string') {
			placeholder.addClass(self.get('placeholder'));
		}
		currentItem.after(placeholder);
		return placeholder;
	}
		
	/**
	 * 事件传递的参数
	 */
	function createUiHash(){
		var self = this;
		return {
			columns: self.columns,
			items: self.items,
			currentItem: self.currentItem,
			currentColumn: self.currentColumn,
			originalColumn: self.originalColumn,
			helper: self.helper,
			placeholder: self.placeholder
		};
	}
		
	// these are odd functions, fix the API or move into individual plugins
	function isOverAxis(x, reference, size){
		//Determines when x coordinate is over "b" element axis
		return (x > reference) && (x < (reference + size));
	}
	
	function isOver(y, x, top, left, height, width){
		//Determines when x, y coordinates is over "b" element
		return isOverAxis(y, top, height) && isOverAxis(x, left, width);
	}
	/**
     * measure two points' distance
     * @param {Object} e
     * @param {Object} item
     * @return {Number} square of distance
     */
    function measure(e, item){
        return Math.pow(e.pageX - item.left, 2) + Math.pow(e.pageY - item.top, 2);
    }
	
	function disableSelection(elem, prefix){
		return elem.bind(($.support.selectstart ? "selectstart" : "mousedown") +
		prefix+ ".-disableSelection", function(event){
			event.preventDefault();
		});
	}
	
	function scrollParent(elem){
	
		var scrollParent;
		if (($.browser.msie && (/(static|relative)/).test(elem.css('position'))) || (/absolute/).test(elem.css('position'))) {
			scrollParent = elem.parents().filter(function(){
				return (/(relative|absolute|fixed)/).test($.css(elem, 'position', 1)) && (/(auto|scroll)/).test($.css(elem, 'overflow', 1) + $.css(elem, 'overflow-y', 1) + $.css(elem, 'overflow-x', 1));
			}).eq(0);
		}
		else {
			scrollParent = elem.parents().filter(function(){
				return (/(auto|scroll)/).test($.css(elem, 'overflow', 1) + $.css(elem, 'overflow-y', 1) + $.css(elem, 'overflow-x', 1));
			}).eq(0);
		}
		
		return (/fixed/).test(elem.css('position')) || !scrollParent.length ? $(document) : scrollParent;
	}
		
	return sortable;
		
});
