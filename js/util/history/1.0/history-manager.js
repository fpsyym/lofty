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
			forceHash:false,	// �� forceHash ����Ϊtrue��������������Ƿ�֧��history API������ʹ��hash�ķ�ʽ(#)
			forceChange:false	// �� force ����Ϊtrue��������URL�Ƿ��б仯��popstate �¼����ᱻ����
		},
		
		init:function (config){
			
			Base.prototype.init.call(this, config || {});

			this.forceChange = !!this.get('forceChange');

			var forceHash = !!this.get('forceHash');
			
			//��������IE7��bug������Ҫreturn History����
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
		 * ����������ʷ��¼���������HTML5�� pushState API
		 * @method add
		 * @param {Object} state ״̬�ļ��ϣ��� { key1: 1, key2: 2}
		 * @param {Object} options (optional)
		 */	
		add: function () {
			var args = $.makeArray(arguments);
			args.unshift('add');
			return changeState.apply(this, args);
		},
	
		/**
		 * ����һ����ʷ��¼���������HTML5�� pushState API
		 * @method addValue
		 * @param {String} key ״̬��key
		 * @param {String} value ״̬��value
		 * @param {Object} options (optional)
		 */	
		addValue: function (key, value, options) {
			var state = {};
			state[key] = value;
			return changeState.call(this, 'add', state, options);
		},
		
		/**
		 * ���������ʷ��¼���������HTML5�� replaceState API
		 * @method replace
		 * @param {Object} state ״̬�ļ��ϣ��� { key1: 1, key2: 2}
		 * @param {Object} options (optional)
		 */
	    replace: function () {
			var args = $.makeArray(arguments);
			args.unshift('replace');
			return changeState.apply(this, args);
		},

		/**
		 * ���һ����ʷ��¼���������HTML5�� replaceState API
		 * @method replaceValue
		 * @param {String} key ״̬��key
		 * @param {String} value ״̬��value
		 * @param {Object} options (optional)
		 */
		replaceValue: function (key, value, options) {
			var state = {};
			state[key] = value;
			return changeState.call(this, 'replace', state, options);
		},
	
		/**
		 * @method getState
		 * @param {String} key (optional) ״̬��id
		 * @return {Object|String} ״̬��Ӧ�ĵ�ǰֵ����idΪ�գ��򷵻�����״ֵ̬
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
	
	// ״̬�洢��ȫ�ֱ���
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

		// �ϲ�initState��bookmarked
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
		
		 // ����ʼ״̬���ڣ���ͬ��ǰ״̬�ϲ�
		if (initialState) {
			this.replace(initialState);
		}
	
	}
		
	/**
	 * @method changeState
	 * @param {String} src  change�¼�Դ.
	 * @param {Object} state ״ֵ̬
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
	 * ��newstate��currentstate��ͬ���򴥷�change�¼�
	 */
	function resolveChanges (src, newState, options) {
		var changed   = {},
			isChanged,
			prevState = GlobalState,
			removed   = {};

		newState || (newState = {});
		options  || (options  = {});

		if (isSimpleObject(newState) && isSimpleObject(prevState)) {
			// �ҳ�����ӻ�ı�ĵ�key
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

			// �ҳ����Ƴ���key
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
			
			// ÿ��key���е�����Change����Remove�¼��������������ⲿ��������
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
	 * @param {String} src change�¼�Դ
	 * @param {Object} newState ��״̬.
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
  
    	