/*!!cmd:compress=true*/
/*!!cmd:jsCompressOpt=["--disable-optimizations"]*/

/**
 * @module lofty/lang/attribute
 * @from modify from arale
 * @author terence.wangt
 * @date 20130702
 * */

define( 'lofty/lang/attribute', ['lofty/lang/class'], function(Class){
   'use strict';
	
	var Attribute = Class({
			
		/**
         * ���Գ�ʼ�������������Է����仯ʱ�����Զ���������¼�
         *
         * @method initOptions
         * @param {Object} config ������Ϣ
         */
		initOptions: function(config) {
			
			var options = this.options = {};
			
			mergeInheritedAttrs(options, this);
			
			if (config) {
				mergeConfig(options, config);
			}
			
			setSetterAttrs(this, options, config);
		},

		/**
         * ��ȡ����
         *
         * @method get
         * @param {String} key ��������
         */
		get: function(key) {
			var option = this.options[key] || {};
			var val = option.value;
			return option.getter ? option.getter.call(this, val, key) : val;
		},

		/**
         * ��������
         *
         * @method set
         * @param {String|Object} key �������ƣ���keyΪObjectʱ������ͬʱ���ö�����ԣ�
						   �磺set({ "key1": val1, "key2": val2 }, options)
	     * @param {String} val ����ֵ
		 * @param {String} options ��������{silent:true}����ֹchange�¼�
         */
		set: function(key, val, options) {
		
			var attrs = {};

			// set("key", val, options)
			if (isString(key)) {
			  attrs[key] = val;
			}
			// set({ "key": val, "key2": val2 }, options)
			else {
			  attrs = key;
			  options = val;
			}

			options || (options = {});
			var silent = options.silent;
			var override = options.override;

			var now = this.options;
			var changed = this.__changedAttrs || (this.__changedAttrs = {});
		
			for (key in attrs) {
				if (!attrs.hasOwnProperty(key)) continue;

				var attr = now[key] || (now[key] = {});
				val = attrs[key];

				if (attr.readOnly) {
					throw new Error('This attribute is readOnly: ' + key);
				}

				// invoke setter
				if (attr.setter) {
					val = attr.setter.call(this, val, key);
				}

				// ��ȡ����ǰ�� prev ֵ
				var prev = this.get(key);

				// ��ȡ��Ҫ���õ� val ֵ
				// ��������� override Ϊ true����ʾҪǿ�Ƹ��ǣ��Ͳ�ȥ merge ��
				// ��Ϊ����ʱ���� merge �������Ա��� prev ��û�и��ǵ�ֵ
				if (!override && isPlainObject(prev) && isPlainObject(val)) {
					val = merge(merge({}, prev), val);
				}

				// set finally
				now[key].value = val;

				// invoke change event
				// ��ʼ��ʱ�� set �ĵ��ã��������κ��¼�
				if (!this.__initializingAttrs && !isEqual(prev, val)) {
					if (silent) {
						changed[key] = [val, prev];
					}
					else {
					  this.trigger(key + 'Changed' , val, prev, key);
					}
				}
			}
			return this;
	    },

		/**
         * change�������������ô˺����ɴ���"change"�¼�
         *
         * @method change
		 * @return {Object} ��������
         */
		change: function() {
			var changed = this.__changedAttrs;

			if (changed) {
				for (var key in changed) {
					if (changed.hasOwnProperty(key)) {
					var args = changed[key];
					this.trigger(key + 'Changed', args[0], args[1], key);
					}
				}
				delete this.__changedAttrs;
			}
			return this;
		}
		
	});
	
	// Private functions
	// -------

	var toString = Object.prototype.toString;
	var hasOwn = Object.prototype.hasOwnProperty;

	  /**
	   * Detect the JScript [[DontEnum]] bug:
	   * In IE < 9 an objects own properties, shadowing non-enumerable ones, are
	   * made non-enumerable as well.
	   * https://github.com/bestiejs/lodash/blob/7520066fc916e205ef84cb97fbfe630d7c154158/lodash.js#L134-L144
	   */
	  /** Detect if own properties are iterated after inherited properties (IE < 9) */
	  var iteratesOwnLast;
	  (function() {
		var props = [];
		function Ctor() { this.x = 1; }
		Ctor.prototype = { 'valueOf': 1, 'y': 1 };
		for (var prop in new Ctor()) { props.push(prop); }
		iteratesOwnLast = props[0] !== 'x';
	  }());

	var isArray = Array.isArray || function(val) {
		return toString.call(val) === '[object Array]';
	};

	function isString(val) {
		return toString.call(val) === '[object String]';
	}

	function isWindow(o) {
		return o != null && o == o.window;
	}
	
	// Thanks to Jquery source code
	function isPlainObject(o) {
		// Must be an Object.
		// Because of IE, we also have to check the presence of the constructor
		// property. Make sure that DOM nodes and window objects don't
		// pass through, as well
		if (!o || toString.call(o) !== "[object Object]" ||
			o.nodeType || isWindow(o)) {
			return false;
		}

		try {
		  // Not own constructor property must be Object
		  if (o.constructor &&
			  !hasOwn.call(o, "constructor") &&
			  !hasOwn.call(o.constructor.prototype, "isPrototypeOf")) {
			return false;
		  }
		} catch (e) {
		  // IE8,9 Will throw exceptions on certain host objects #9897
		  return false;
		}

		var key;

		// Support: IE<9
		// Handle iteration over inherited properties before own properties.
		// http://bugs.jquery.com/ticket/12199
		if (iteratesOwnLast) {
		  for (key in o) {
			return hasOwn.call(o, key);
		  }
		}

		// Own properties are enumerated firstly, so to speed up,
		// if last one is own, then all properties are own.
		for (key in o) {}

		return key === undefined || hasOwn.call(o, key);
	}

	function isEmptyObject(o) {
		if (!(o && toString.call(o) === "[object Object]")) {
			return false;
		}

		for (var p in o) {
			if (o.hasOwnProperty(p)) return false;
		}
		return true;
	}

	function merge(receiver, supplier) {
  
		var key, value;

		for (key in supplier) {
		  if (supplier.hasOwnProperty(key)) {
			value = supplier[key];

			// ֻ clone ����� plain object�������ı��ֲ���
			if (isArray(value)) {
			  value = value.slice();
			}
			else if (isPlainObject(value)) {
			  var prev = receiver[key];
			  isPlainObject(prev) || (prev = {});

			  value = merge(prev, value);
			}
			receiver[key] = value;
		  }
		}

		return receiver;
	}

	var keys = Object.keys;

	if (!keys) {
		keys = function(o) {
		  var result = [];

		  for (var name in o) {
			if (o.hasOwnProperty(name)) {
			  result.push(name);
			}
		  }
		  return result;
		};
	}

	function mergeInheritedAttrs(options, instance) {
	
		var inherited = [];
		var proto = instance.constructor.prototype;

		while (proto) {
			// ��Ҫ�õ� prototype �ϵ�
			if (!proto.hasOwnProperty('options')) {
				proto.options = {};
			}

			// Ϊ��ʱ�����
			if (!isEmptyObject(proto.options)) {
				inherited.unshift(proto.options);
			}

			// ���ϻ���һ��
			proto = proto.constructor.superclass;
		}

		// Merge and clone default values to instance.
		for (var i = 0, len = inherited.length; i < len; i++) {
			merge(options, normalize(inherited[i]));
		}
	}

	function mergeConfig(options, config) {
		merge(options, normalize(config, true));
	}

	function setSetterAttrs(host, options, config) {
		var opt = { silent: true };
		host.__initializingAttrs = true;

		for (var key in config) {
		  if (config.hasOwnProperty(key)) {
			if (options[key].setter) {
			  host.set(key, options[key].value, opt);
			}
		  }
		}
		delete host.__initializingAttrs;
	}


	var ATTR_SPECIAL_KEYS = ['value', 'getter', 'setter', 'readOnly'];

	// normalize `options` to
	//
	//   {
	//      value: 'xx',
	//      getter: fn,
	//      setter: fn,
	//      readOnly: boolean
	//   }
	//
	function normalize(options, isUserValue) {
		var newAttrs = {};

		for (var key in options) {
		  var option = options[key];

		  if (!isUserValue &&
			  isPlainObject(option) &&
			  hasOwnProperties(option, ATTR_SPECIAL_KEYS)) {
			newAttrs[key] = option;
			continue;
		  }

		  newAttrs[key] = {
			value: option
		  };
		}

		return newAttrs;
	}

	function hasOwnProperties(object, properties) {
		for (var i = 0, len = properties.length; i < len; i++) {
		  if (object.hasOwnProperty(properties[i])) {
			return true;
		  }
		}
		return false;
	}


	// ���� options �� value ��˵������ֵ����Ϊ�ǿ�ֵ�� null, undefined, '', [], {}
	function isEmptyAttrValue(o) {
		return o == null || // null, undefined
			(isString(o) || isArray(o)) && o.length === 0 || // '', []
			isEmptyObject(o); // {}
	}

	// �ж�����ֵ a �� b �Ƿ���ȣ�ע�������������ֵ���жϣ������ʵ� === �� == �жϡ�
	function isEqual(a, b) {
		if (a === b) return true;

		if (isEmptyAttrValue(a) && isEmptyAttrValue(b)) return true;

		// Compare `[[Class]]` names.
		var className = toString.call(a);
		if (className != toString.call(b)) return false;

		switch (className) {

		  // Strings, numbers, dates, and booleans are compared by value.
		  case '[object String]':
			// Primitives and their corresponding object wrappers are
			// equivalent; thus, `"5"` is equivalent to `new String("5")`.
			return a == String(b);

		  case '[object Number]':
			// `NaN`s are equivalent, but non-reflexive. An `equal`
			// comparison is performed for other numeric values.
			return a != +a ? b != +b : (a == 0 ? 1 / a == 1 / b : a == +b);

		  case '[object Date]':
		  case '[object Boolean]':
			// Coerce dates and booleans to numeric primitive values.
			// Dates are compared by their millisecond representations.
			// Note that invalid dates with millisecond representations
			// of `NaN` are not equivalent.
			return +a == +b;

		  // RegExps are compared by their source patterns and flags.
		  case '[object RegExp]':
			return a.source == b.source &&
				a.global == b.global &&
				a.multiline == b.multiline &&
				a.ignoreCase == b.ignoreCase;

		  // ���ж���������� primitive ֵ�Ƿ����
		  case '[object Array]':
			var aString = a.toString();
			var bString = b.toString();

			// ֻҪ������ primitive ֵ��Ϊ����������������� false
			return aString.indexOf('[object') === -1 &&
				bString.indexOf('[object') === -1 &&
				aString === bString;
		}

		if (typeof a != 'object' || typeof b != 'object') return false;

		// ���ж����������Ƿ���ȣ�ֻ�жϵ�һ��
		if (isPlainObject(a) && isPlainObject(b)) {

		  // ��ֵ����ȣ����̷��� false
		  if (!isEqual(keys(a), keys(b))) {
			return false;
		  }

		  // ����ͬ������ֵ���ȣ����̷��� false
		  for (var p in a) {
			if (a[p] !== b[p]) return false;
		  }

		  return true;
		}

		// ����������� false, �Ա������е��� change �¼�û����
		return false;
	}
	
	return Attribute;

});
