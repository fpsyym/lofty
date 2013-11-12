/*!!cmd:compress=true*/
/*!!cmd:jsCompressOpt=["--disable-optimizations"]*/

/**
 * @module lofty/ui/dragdrop
 * @author wb_wanli.hewl
 * @date 2013-09-21
 * @desc 拖放操作组件
 */

define('lofty/ui/dragdrop/1.0/dragdrop', ['lofty/lang/class', 'lofty/ui/widget/1.0/widget','jquery'],function(Class, Widget, $){
    'use strict';
    //私有属性和方法
    var doc = window.document,
    E = {
        on : function(el, type, fn){
            el.addEventListener ?
                el.addEventListener(type, fn, false) :
            el.attachEvent ?
                el.attachEvent("on" + type, fn) :
            el['on'+type] = fn;
        },
        un : function(el,type,fn){
            el.removeEventListener ?
                el.removeEventListener(type, fn, false) :
            el.detachEvent ?
                el.detachEvent("on" + type, fn) :
            el['on'+type] = null;
        },
        evt : function(e){
            return e || window.event;
        }
    };
    var Dragdrop=Class ( Widget, {
            options: {
                dragable:true,//是否可以拖拽默认为true
                dragX:true,//是否可以沿着X轴拖拽默认为true
                dragY:true//是否可以沿着Y轴拖拽默认为true
            },
            // 入口函数
            _create:function (){
                var target=this.get("targetSelector")?$(this.get("targetSelector")).eq(0)[0]:this.get("target"),
                    bridge=$(target).find(this.get("bridgeSelector")).eq(0)[0],
                    callback=this.get('callback'),
                    that=this,
                    diffX, diffY;
                bridge!==undefined?
                    E.on(bridge,'mousedown',mousedown) :
                    E.on(target,'mousedown',mousedown);
                bridge!==undefined?
                    bridge.style.cursor = 'move':
                    target.style.cursor = 'move';

                function mousedown(e){
                    var e = E.evt(e);
                    target.style.position = 'absolute';
                    if(target.setCapture){ //IE
                        E.on(target, "losecapture", mouseup);
                        target.setCapture();
                        e.cancelBubble = true;
                    }else if(window.captureEvents){ //标准DOM
                        e.stopPropagation();
                        E.on(window, "blur", mouseup);
                        e.preventDefault();
                    }
                    diffX = e.clientX - target.offsetLeft;
                    diffY = e.clientY - target.offsetTop;
                    E.on(doc,'mousemove',mousemove);
                    E.on(doc,'mouseup',mouseup);
                }
                function mousemove(e){
                    var e = E.evt(e), 
                        moveX = e.clientX - diffX, 
                        moveY = e.clientY - diffY;
                    var minX=0,
                        maxX=$(document).width()-$(target).width(),
                        minY=0,
                        maxY=$(document).height()-$(target).height();
                    if(that.get('area') && that.get('area').length==4){
                        minX = that.get('area')[0];
                        maxX = that.get('area')[1];
                        minY = that.get('area')[2];
                        maxY = that.get('area')[3];
                    }
                    moveX < minX && (moveX = minX); // left 最小值
                    moveX > maxX && (moveX = maxX); // left 最大值
                    moveY < minY && (moveY = minY); // top 最小值
                    moveY > maxY && (moveY = maxY); // top 最大值

                    if(that.get('dragable')){
                        that.get('dragX') && (target.style.left = moveX + 'px');
                        that.get('dragY') && (target.style.top =  moveY + 'px');
                        if(callback){
                            var obj = {moveX:moveX,moveY:moveY};
                            callback.call(that,obj);
                        }
                    }
                }
                function mouseup(e){
                    E.un(doc,'mousemove',mousemove);
                    E.un(doc,'mouseup',mouseup);
                    if(target.releaseCapture){ //IE
                        E.un(target, "losecapture", mouseup);
                        target.releaseCapture();
                    }
                    if(window.releaseEvents){ //标准DOM
                        E.un(window, "blur", mouseup);
                    }
                }
            },
            dragX : function(){
                this.set('dragX',true);
                this.set('dragY',false);
            },
            dragY : function(){
                this.set('dragY',true);
                this.set('dragX',false);
            },
            dragAll : function(){
                this.set('dragX',true);
                this.set('dragY',true);
            },
            setArea : function(a){
                this.set('area',a);
            },
            setDragable : function(b){
                this.set('dragable',b);
            },
            getDragX : function(){
                return this.get('dragX');
            },
            getDragY : function(){
                return this.get('dragY');
            }
        });
    return Dragdrop;
});