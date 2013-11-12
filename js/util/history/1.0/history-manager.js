/*!!cmd:compress=true*/
/*!!cmd:jsCompressOpt=["--disable-optimizations"]*/

/**
 * @module lofty/util/historyManager
 * @author terence.wangt
 * @date 20130820
 * 
 */
 
define( 'lofty/util/history/1.0/historyManager', ['lofty/lang/class', 
											  'lofty/lang/base', 
											  'lofty/util/history/1.0/history', 
											  'jquery'], 
	function(Class, Base, History, $){
	'use strict';
  
	 var HistManager = Class( Base, {
	 
		options: {
			forceHash:false,	// 若 forceHash 设置为true，则无论浏览器是否支持history API，都将使用hash的方式(#)
			forceChange:false	// 若 force 设置为true，则无论URL是否有变化，popstate 事件都会被触发
		},
		
		init:function (config){
			
			Base.prototype.init.call(this, config || {});

			this.forceChange = !!this.get('forceChange');

			var forceHash = !!this.get('forceHash');
			
			//这里由于IE7的bug，必须要return History对象
			History = History.init({
				forceHash: forceHash
			});
			
			initState.call(this);
			
			var self = this;
			this.on("change",  function (e) {
				storeState.call(self, e.src, e.newVal, e._options);
			});
		},
				
		/**
		 * 批量增加历史记录，将会调用HTML5的 pushState API
		 * @method add
		 * @param {Object} state 状态的集合，如 { key1: 1, key2: 2}
		 * @param {Object} options (optional)
		 */	
		add: function () {
			var args = $.makeArray(arguments);
			args.unshift('add');
			return changeState.apply(this, args);
		},
	
		/**
		 * 增加一条历史记录，将会调用HTML5的 pushState API
		 * @method addValue
		 * @param {String} key 状态的key
		 * @param {String} value 状态的value
		 * @param {Object} options (optional)
		 */	
		addValue: function (key, value, options) {
			var state = {};
			state[key] = value;
			return changeState.call(this, 'add', state, options);
		},
		
		/**
		 * 批量替代历史记录，将会调用HTML5的 replaceState API
		 * @method replace
		 * @param {Object} state 状态的集合，如 { key1: 1, key2: 2}
		 * @param {Object} options (optional)
		 */
	    replace: function () {
			var args = $.makeArray(arguments);
			args.unshift('replace');
			return changeState.apply(this, args);
		},

		/**
		 * 替代一条历史记录，将会调用HTML5的 replaceState API
		 * @method replaceValue
		 * @param {String} key 状态的key
		 * @param {String} value 状态的value
		 * @param {Object} options (optional)
		 */
		replaceValue: function (key, value, options) {
			var state = {};
			state[key] = value;
			return changeState.call(this, 'replace', state, options);
		},
	
		/**
		 * @method getState
		 * @param {String} key (optional) 状态的id
		 * @return {Object|String} 状态对应的当前值，若id为空，则返回所有状态值
		 */
		getState: function (key) {
			var state = GlobalState,
				isObject = isSimpleObject(state);

			if (key) {
				return isObject && state[key] ? state[key] : undefined;
			} else {
				return isObject ? $.extend({}, state, true) : state; // mix provides a fast shallow clone.
			}
		}
		
	});
	
	// 状态存储的全局变量
	var GlobalState = {};
	 
	function isSimpleObject(value) {
		return 'object' === typeof value;
	}
	
	function initState(){
		
		var initialState = null;
		var bookmarkedState = History.state;

		if ($.isEmptyObject(bookmarkedState)) {
			bookmarkedState = null;
		}

		// 合并initState和bookmarked
		var initState = this.get('initialState');
		if (initState && $.isPlainObject(initState) && $.isPlainObject(bookmarkedState)) {
			initialState = $.extend({}, initState, bookmarkedState, true);
		} else {
			initialState = bookmarkedState;
		}

		var self = this;
		
		$( window ).bind( "popstate", function( e ) {
			resolveChanges.call(self, "mypopstate", History.state || null);
		});
		
		 // 若初始状态存在，则同当前状态合并
		if (initialState) {
			this.replace(initialState);
		}
	
	}
		
	/**
	 * @method changeState
	 * @param {String} src  change事件源.
	 * @param {Object} state 状态值
	 * @param {Object} options (optional) 
	 * @chainable
	 */
	function changeState (src, state, options) {
		options = options ? $.extend({merge:true}, options) : {merge:true};

		if (options.merge && isSimpleObject(state) && isSimpleObject(GlobalState)) {
			state = $.extend({}, GlobalState, state, true);
		}
		resolveChanges.call(this, src, state, options);
		return this;
	}
	
	/**
	 * 若newstate与currentstate不同，则触发change事件
	 */
	function resolveChanges (src, newState, options) {
		var changed   = {},
			isChanged,
			prevState = GlobalState,
			removed   = {};

		newState || (newState = {});
		options  || (options  = {});

		if (isSimpleObject(newState) && isSimpleObject(prevState)) {
			// 找出被添加或改变的的key
			$.each(newState, function (key, newVal) {
				var prevVal = prevState[key];

				if (newVal !== prevVal) {
					changed[key] = {
						newVal : newVal,
						prevVal: prevVal
					};

					isChanged = true;
				}
			});

			// 找出被移除的key
			$.each(prevState, function (key, prevVal) {
				if (newState[key] === undefined || newState[key] === null) {
					delete newState[key];
					removed[key] = prevVal;
					isChanged = true;
				}
			});
		} else {
			isChanged = newState !== prevState;
		}

		if (isChanged || this.forceChange) {
			this.trigger("change", {
				_options: options,
				changed : changed,
				newVal  : newState,
				prevVal : prevState,
				removed : removed,
				src     : src
			});
			
			// 每个key都有单独的Change或是Remove事件触发，可以在外部监听他们
			var self = this;
			$.each(changed, function (key, value) {
				self.trigger(key + 'Change', {
					newVal : value.newVal,
					prevVal: value.prevVal,
					src    : src
				});
			});

			$.each(removed, function (key, value) {
				self.trigger(key + 'Remove', {
					prevVal: value,
					src    : src
				});
			});
		}
	}
	
	/**
	 *
	 * @method storeState
	 * @param {String} src change事件源
	 * @param {Object} newState 新状态.
	 * @param {Object} options 
	 * @protected
	 */
	function storeState(src, newState, options) {

		if (src !== "mypopstate") {
			History[src === "replace" ? 'replaceState' : 'pushState'](
				newState,
				options.title || '',
				options.url || null
			);
		}
		GlobalState = newState || {};
	}

	return HistManager;
  
  });
  
    	