/*!!cmd:compress=true*/
/*!!cmd:jsCompressOpt=["--disable-optimizations"]*/

/**
 * @module lofty/ui/position
 * @from   rewrite again
 * @author qian.wq
 * @date 20130830
 * */

define('lofty/ui/position/1.0/position', ['lofty/lang/class', 'lofty/ui/widget/1.0/widget', 'jquery'], function(Class, Widget, $) {
	'use strict';

	var Position = Class(Widget, {
		options: {
			winListen : false,//��������size�仯
			targetNode : '',
			baseNode : 'body', //���û��baseNode��Ĭ��ֵΪbody
			offsetX:'left',
			offsetY:'top'
		},
		_create: function() {
            bindWindowEvent.call(this);
			this.locate();
		},
		setOffsetX:function(offsetX){
			this.set('offsetX',offsetX);
			return this;			
		},
		setOffsetY:function(offsetY){
			this.set('offsetY',offsetY);
			return this;	
		},
		locate:function(){
	
			var targetNode = $(this.get('targetNode')), 
				baseNode = $(this.get('baseNode')),
				winListen = this.get('winListen'), 
				offsetX = this.get('offsetX'),
				offsetY = this.get('offsetY'),
				position = targetNode.css('position'),
				mLeft = targetNode.css('margin-left'),
				mTop = targetNode.css('margin-top');
			    
				mLeft = mLeft.replace(/px/gi, '');
				mTop = mTop.replace(/px/gi, '');
			
			//��relative��Ԫ��ͳһת����absolute
			if(position!='relative'){
				$(this.get('targetNode')).css('position','absolute');
			}
			
			//��ȡbaseNode�ڵ��left �� topλ��
			var baseNodeLeft = baseNode.offset().left,
				baseNodeTop = baseNode.offset().top;
			
			//��ȡtargetNode ��offsetParent
			var parentOffset = getParentOffset.call(this);

			//����targetNode��x y
			var offset = normalizeXY(offsetX,offsetY,targetNode,baseNode);
					
			//����targetNode�ڵ��left �� topλ��
			var left = baseNodeLeft + offset.left,
				top = baseNodeTop + offset.top;

			//relative��Ԫ�أ�ƫ��ʱ�������Ԫ�������ԭʼλ�ý���ƫ��
			//����left��topʱ��Ҫ��ȥ
			if(position=='relative'){
			    var currentLeft = parseInt(targetNode.css('left'),10),
				    currentTop = parseInt(targetNode.css('top'),10);
				
			    left = left - targetNode.offset().left + (currentLeft?currentLeft:0);
				top = top - targetNode.offset().top + (currentTop?currentTop:0);
			}else{
			    left = left - mLeft - parentOffset.left;
				top = top - mTop - parentOffset.top;
			}
			
			targetNode.css({left:left,top:top});	
				
		}
	});
	
	//��ȡtargetԪ�ص�parentOffset
	function getParentOffset(){
		var	targetNode = $(this.get('targetNode')),
			parent = targetNode.offsetParent();
           
        if (parent[0] === document.documentElement) {
            parent = $(document.body);
        }
		//ie6����absolute ��λ��׼�� bug
        if (($.browser.msie && ($.browser.version == "6.0"))) {
            parent.css('zoom', 1);
        }

        var offset;

        if (parent[0] === document.body &&
            parent.css('position') === 'static') {
                offset = { top:0, left: 0 };
        } else {
            offset = getOffset(parent[0]);
        }
            
        return offset;
	}
	
	//��׼��option�е�offsetX��offsetY
	function normalizeXY(offsetX,offsetY,targetNode,baseNode){
		
		var offset = {left:'',top:''},
			width = $(baseNode).outerWidth() - $(targetNode).outerWidth(),
			height = $(baseNode).outerHeight() - $(targetNode).outerHeight();
			
			offset.left = xyConverter(offsetX,width);
			offset.top = xyConverter(offsetY,height);
			
		return offset;
	}
	
	function xyConverter(offset, length) {

		offset = offset + '';

		//ȥ��px
		offset = offset.replace(/px/gi, '');
		
		//���� left | right | top | bottom�����
		if (/\D/.test(offset)) {
			offset = offset.replace(/(?:top|left)/gi, '0%')
				 .replace(/center/gi, '50%')
				 .replace(/(?:bottom|right)/gi, '100%');
		}

		//���� 30%�����
		if (offset.indexOf('%') !== -1) {

			offset = offset.replace(/(\d+(?:\.\d+)?)%/gi, function(m, d) {
				return length * (d / 100.0);
			});
		}
			
		//���� 50% + 20px�����
		if (/[+\-*\/]/.test(offset)) {
			try {
				offset = (new Function('return ' + offset))();
			} catch (e) {
				throw new Error('Invalid position value: ' + offset);
			}
		}

		return numberize(offset);
	}
	
	function numberize(s) {
        return parseFloat(s, 10) || 0;
    }
	function getOffset(element) {
        var box = element.getBoundingClientRect(),
            docElem = document.documentElement;

        // < ie8 ��֧�� win.pageXOffset, ��ʹ�� docElem.scrollLeft
        return {
            left: box.left + (window.pageXOffset || docElem.scrollLeft) -
                  (docElem.clientLeft || document.body.clientLeft  || 0),
            top: box.top  + (window.pageYOffset || docElem.scrollTop) -
                 (docElem.clientTop || document.body.clientTop  || 0)
        };
    }
	
	var a = 0;
	function getGuid(){
		if(!this.guid){
			this.guid = a++;
		}
		return this.guid;
	}
	function bindWindowEvent(){
	    var self = this;
		if(self.get('winListen')==true){   
			$(window).on('resize._position_'+getGuid.call(this),function(){	
				if(self.timeoutId){
					clearTimeout(self.timeoutId);
				} 
				self.timeoutId = setTimeout(function(){
					self.locate();
				},50);
			})
		}else{
			$(window).off('resize._position_'+getGuid.call(this));
		}
	}
	
	return Position;
});