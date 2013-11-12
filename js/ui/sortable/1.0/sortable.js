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
            axis: false,							// ����������ˣ���ѡ��ֻ�ܱ�ˮƽ���ߴ�ֱ�ж�,��ѡ��ֵ��"x","y"
            orientation: 'vertical',				// �����õ������Ǹ��������㷨��ָ��ģ��������򡣵�����ģ��ȫ��λ��ˮƽʱ��Ҫʹ��"horizontal"
            handle: false,							// ��������Ķ���ֻ����itemԪ�ص�ĳ��Ԫ�ؿ�ʼ
            items: '> *',							// ������Ϊѡ�������ṩ����ģ��Ľڵ�������
            modal: true,							 
			helper: 'original',						// �����Ƿ�����קԪ��ʱ����ʾһ��������Ԫ�ء���ѡֵ�� 'original','clone'
			appendTo: 'parent',						// ָ��helper׷�����ĸ�Ԫ�غ���
			opacity: false,							// 0 - 1 ֮�����ֵ������"helper"��͸����
            placeholder: false,						// ���õ�����������ʱ���հ�ռλ����CSS��ʽ
            dropOnEmpty: true,						// ��"columns"�ж��������£�����ĳ��"column"��û��"item"���Ƿ����������"column"��ק"item"���յ�"column"��
            scroll: true,							// ��ק�������Ƿ�������ܹ���
            scrollSensitivity: 20,					// ���õ�Ԫ���ƶ�����Ե��������ʱ���㿪ʼ����ҳ��
            scrollSpeed: 20,						// ����ҳ��Ĺ����ٶ�
            revert: false,							// ��ק�������ͷ�����"helper"��"placeholder"��һ������Ч����ʱ��(����)
            revertOuter: false,						 
            zIndex: 1000,							// ��קʱ"helper"��"z-index"��ʽ����
			classPrefix:'fui'						// Ĭ�ϵ�classǰ׺
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
		 * ���������destroy��ʱ�����
		 * @protected
		 */
        destroy: function(){
            this.get('el').removeClass(this.prefix + '-sortable ' + this.prefix + '-sortable-disabled');
            this.mouseDestroy();
			this.constructor.superclass.destory.call(this);
        },
        
		/**
		 * ����mouse��� mouseCapture����
		 * @private
		 */
        mouseCapture: function(e){
            var currentItem;
            //���� �������/����
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
                //����handler�е�Ԫ�أ��ж��Ƿ�Ϊe.target
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
		 * ����mouse��� mouseStart����
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
            //1.�ȳ�ʼ��ռλ��
            placeholder = (this.placeholder = createPlaceholder.call(this, e));
            
            //2.�ٳ�ʼ��helper
            helper = (this.helper = createHelper.call(this, e));
            
            //������굽currentItem���Ͻǵ�����
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
                //��ֹ����ѡ��
                disableSelection($(document), this.prefix);
            }
            
            //get currentColumn
            getCurrentColumn.call(this);
            this.originalColumn = this.currentColumn;
            
            this.dragging = true;
            //Call callbacks
            this.trigger('start', createUiHash.call(this), e);
            //start���ܻ�ı�ṹ��������ˢ����������
            refreshPositions.call(this);
            
            return true;
        },
        
		/**
		 * ����mouse��� mouseDrag����
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
                //�ж��Ƿ��ڡ�Column����������
                if (isVertical) {
                    inColumn = column.left <= e.pageX && e.pageX <= column.left + column.width;
                }
                else {
                    inColumn = column.top <= e.pageY && e.pageY <= column.top + column.height;
                }
                //��ĳһColumn��
                if (inColumn) {
                    target = column.dom;
                    //�л�Column
                    if (currentColumn[0] !== target) {
                        currentColumn = this.currentColumn = $(target);
                        this.trigger('over', createUiHash.call(this), e);
                    }
                    //Column������Item
                    if (currentColumn.hasClass( this.prefix + '-sortable-unreceivable')) {
                        return;
                    }
                    //Init Column�߽�ֵ
                    var minEdge = Number.MAX_VALUE, maxEdge = Number.MIN_VALUE;
                    
                    for (var j = items.length - 1; j > -1; j--) {
                        var item = items[j];
                        //�ų���ǰ��
                        if (item.dom && item.dom === this.currentItem[0]) {
                            continue;
                        }
                        //�ų������ڵ�ǰColumn��item
                        if (!$.contains(currentColumn[0], item.dom)) {
                            continue;
                        }
                        //�Ƿ���ĳItem������
                        var distances, bOver = isOver(e.pageY, e.pageX, item.top, item.left, item.height, item.width);
                        //����Column�ı߽�
                        minEdge = Math.min(isVertical ? item.top : item.left, minEdge);
                        maxEdge = Math.max(isVertical ? item.top + item.height : item.left + item.width, maxEdge);
                        if (bOver) {
                            target = item.dom;
                            //������굽��ǰItem���ĸ��ǵľ���
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
                            //��ȡ��С����Ӷ�ȷ��placeholder�����λ��
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
                    //������겻���κ�Item�Ϸ����ų���ǰ������ж����λ��Column���Ϸ������·�
                    if (!direction) {
                        //���С�ڱ߽�
                        if ((isVertical ? e.pageY : e.pageX) < minEdge) {
                            direction = 'prepend';
                        }
                        //������ڱ߽����Column��û��Item
                        else if ((isVertical ? e.pageY : e.pageX) > maxEdge || maxEdge < 0) {
                            direction = 'append'
                        }
                    }
                    break;
                }
            }
            //�����ĳColumn������ ����direction
            if (target && direction) {
                //λ��û�иı�
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
                    //����change�¼����¼�����false��ִ�����������ڵĲ���
                    if (direction === 'append' || direction === 'prepend') {
                        if ($.isFunction(this.get('dropOnEmpty'))) {
                            hasChanged = this.get('dropOnEmpty').call(this.get('el')[0], e, createUiHash.call(this));
                            //dropOnEmpty����false ������֯Ĭ�ϵ�change�¼���������ҪrefreshPositions
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
                    //ˢ������
                    refreshPositions.call(this, true);
                }
                return;
            }
        },
        
		
		/**
		 * ����mouse��� mouseStop����
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
	 * ���»��currentColumn
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
	 * ������굽item���ϽǾ���
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
			//�ͷ�����ѡ��
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
	 * ˢ��colums��items��Ϣ
	 */
	function refreshItems(){
		var self = this, elem = self.get('el'), columns;
		//�������Ϣ����
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
	 * ˢ��colums��items������Ϣ
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
	 * ������������
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
						//Ϊ�γ�ʼ��left��top��ֵ��IE�£����������ֵ��������ȡhelper�����ʱ��������
						left: currentItemCache.left - currentItemCache.offset.left,
						top: currentItemCache.top - currentItemCache.offset.top
					});
		//format
		//��������϶�original
		if (helper[0] !== currentItem[0]) {
			currentItem.hide();
			$(self.get('appendTo') !== 'parent' ? self.get('appendTo') : currentItem[0].parentNode)[0].appendChild(helper[0]);
		}
		return helper;
	}
	
	 /**
	 * ����ռλ����
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
	 * �¼����ݵĲ���
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
