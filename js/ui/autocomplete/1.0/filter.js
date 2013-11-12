/*!!cmd:compress=true*/
/*!!cmd:jsCompressOpt=["--disable-optimizations"]*/

/**
 * @module fdui/ui/autocomplete/filter
 * @from 
 * @author chuanpeng.qchp
 * @date 20130823
 * */
  
define( 'lofty/ui/autocomplete/1.0/filter', ['jquery'], 
	
  function($){
  'use strict';
    	
    var Filter = {
        'startsWith': function(data, query) {
            var result = [], l = query.length,
                reg = new RegExp('^' + escapeKeyword(query));

            if (!l) return [];

            $.each(data, function(index, item) {
                var o = {}, matchKeys = getmatchKeys(item);

                if ($.isPlainObject(item)) {
                    o = $.extend({}, item);
                }
				for(var i=0,j=matchKeys.length;i<j;i++){
					if (reg.test(matchKeys[i])) {
						result.push(o);
						break;
					}
				}
                
            });
            return result;
        },


        'stringMatch': function(data, query) {
            query = query || '';
            var result = [], l = query.length;

            if (!l) return [];

            $.each(data, function(index, item) {
                var o = {}, matchKeys = getmatchKeys(item);

                if ($.isPlainObject(item)) {
                    o = $.extend({}, item);
                }
				
				for(var i=0,j=matchKeys.length;i<j;i++){
					if (matchKeys[i].indexOf(query) > -1) {
						result.push(o);
						break;
					}
				}
				
                
            });
            return result;
        }
	};
	function getmatchKeys(item) {
		var matchKeys;
        if ($.isPlainObject(item)) {
			matchKeys = item.alias ? item.alias.slice(0) : [];
			item.value && matchKeys.push(item.value);
        } else {
			matchKeys = [item];            
        }
		return matchKeys;
    }
    // ת������ؼ���
    var keyword = /(\[|\[|\]|\^|\$|\||\(|\)|\{|\}|\+|\*|\?|\\)/g;
    function escapeKeyword (str) {
      return (str || '').replace(keyword, '\\$1');
    }
	return Filter;
} );
