/*!!cmd:compress=true*/
/*!!cmd:jsCompressOpt=["--disable-optimizations"]*/

/**
 * @module lofty/ui/mouse
 * @author terence.wangt
 * @from modify from jquery ui mouse plugin
 * @date 20130902
 * 
 */
 
define('lofty/ui/sortable/1.0/mouse', ['lofty/ui/widget/1.0/widget', 'lofty/lang/class', 'jquery'], function(Widget, Class, $){
	'use strict';
	
	var Mouse = Class( Widget, {
	
		options: {
			cancel: "input,textarea,button,select,option",
			distance: 1,
			delay: 0,
			widgetName:'mouse'
		},
		
		mouseInit: function() {
		
			var self = this;
			self.widgetName = this.get('widgetName');
			this.get('el').bind("mousedown."+this.widgetName, function(event) {
					return self.mouseDown(event);
				})
				.bind("click."+this.widgetName, function(event) {
					if (true === $.data(event.target, self.widgetName + ".preventClickEvent")) {
						$.removeData(event.target, self.widgetName + ".preventClickEvent");
						event.stopImmediatePropagation();
						return false;
					}
				});

			this.started = false;
		},

		// TODO: make sure destroying one instance of mouse doesn't mess with
		// other instances of mouse
		mouseDestroy: function() {
			this.get('el').unbind("."+this.widgetName);
			if ( this._mouseMoveDelegate ) {
				$(document)
					.unbind("mousemove."+this.widgetName, this._mouseMoveDelegate)
					.unbind("mouseup."+this.widgetName, this._mouseUpDelegate);
			}
		},

		mouseDown: function(event) {
			// don't let more than one widget handle mouseStart
			if( mouseHandled ) { return; }

			// we may have missed mouseup (out of window)
			(this._mouseStarted && this.mouseUp(event));

			this._mouseDownEvent = event;

			var that = this,
				btnIsLeft = (event.which === 1),
				// event.target.nodeName works around a bug in IE 8 with
				// disabled inputs (#7620)
				elIsCancel = (typeof this.get('cancel') === "string" && event.target.nodeName ? $(event.target).closest(this.get('cancel')).length : false);
			if (!btnIsLeft || elIsCancel || !this.mouseCapture(event)) {
				return true;
			}

			this.mouseDelayMet = !this.get('delay');
			if (!this.mouseDelayMet) {
				this._mouseDelayTimer = setTimeout(function() {
					that.mouseDelayMet = true;
				}, this.get('delay'));
			}
			
			if (mouseDistanceMet.call(this, event) && mouseDelayMet.call(this, event)) {
				this._mouseStarted = (this.mouseStart(event) !== false);
				if (!this._mouseStarted) {
					event.preventDefault();
					return true;
				}
			}

			// Click event may never have fired (Gecko & Opera)
			if (true === $.data(event.target, this.widgetName + ".preventClickEvent")) {
				$.removeData(event.target, this.widgetName + ".preventClickEvent");
			}

			// these delegates are required to keep context
			this._mouseMoveDelegate = function(event) {
				return that.mouseMove(event);
			};
			this._mouseUpDelegate = function(event) {
				return that.mouseUp(event);
			};
			$(document)
				.bind("mousemove."+this.widgetName, this._mouseMoveDelegate)
				.bind("mouseup."+this.widgetName, this._mouseUpDelegate);

			event.preventDefault();

			mouseHandled = true;
			return true;
		},

		mouseMove: function(event) {
			// IE mouseup check - mouseup happened when mouse was out of window
			if ($.browser.msie && ( !document.documentMode || document.documentMode < 9 ) && !event.button) {
				return this.mouseUp(event);
			}

			if (this._mouseStarted) {
				this.mouseDrag(event);
				return event.preventDefault();
			}

			if (mouseDistanceMet.call(this, event) && mouseDelayMet.call(this, event)) {
				this._mouseStarted =
					(this.mouseStart(this._mouseDownEvent, event) !== false);
				(this._mouseStarted ? this.mouseDrag(event) : this.mouseUp(event));
			}

			return !this._mouseStarted;
		},

		mouseUp: function(event) {
			$(document)
				.unbind("mousemove."+this.widgetName, this._mouseMoveDelegate)
				.unbind("mouseup."+this.widgetName, this._mouseUpDelegate);

			if (this._mouseStarted) {
				this._mouseStarted = false;

				if (event.target === this._mouseDownEvent.target) {
					$.data(event.target, this.widgetName + ".preventClickEvent", true);
				}

				this.mouseStop(event);
			}

			return false;
		},

		
		// 展位方法，子类可以选择性覆盖
		mouseStart: function(/* event */) {},
		mouseDrag: function(/* event */) {},
		mouseStop: function(/* event */) {},
		mouseCapture: function(/* event */) { return true; }
			
	});
	
	//////////// private functions //////////////
	//////
	function mouseDistanceMet(event) {
		return (Math.max(
				Math.abs(this._mouseDownEvent.pageX - event.pageX),
				Math.abs(this._mouseDownEvent.pageY - event.pageY)
			) >= this.get('distance')
		);
	}
		
	function mouseDelayMet() {
		return this.mouseDelayMet;
	}
		
	var mouseHandled = false;
	$( document ).mouseup( function() {
		mouseHandled = false;
	});
	
	return Mouse;
	
});