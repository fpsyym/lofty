/**
 * @module lofty/lang/pluginhost
 * @author terence.wangt
 * @date 20130701
 * */
 
define( 'lofty/lang/pluginhost', ['lofty/lang/class'], function(Class){
	'use strict';
    
	var PluginHost = Class({
				
		/**
         * ����������в�����
         *
         * @method install
         * @param P {Function | Object |Array} �����ǲ���࣬����һ������{plg:PluginClass, cfg:{}}
         *        							   ���ܲ���Ϊ������������������ͬʱ���������
         * @param config (Optional) �����������
         * @return {Base} �������������Ӧ��
         */
        install: function(Plugin, config) {
		
            var i, ln, name;
			this._plugins || (this._plugins = {});

            if (isArray(Plugin)) {
                for (i = 0, ln = Plugin.length; i < ln; i++) {
                    this.install(Plugin[i]);
                }
            } else {
                if (Plugin && !isFunction(Plugin)) {
                    config = Plugin.cfg;
                    Plugin = Plugin.plg;
                }

                if (Plugin && Plugin.Name) {
                    name = Plugin.Name;
        
                    config = config || {};
                    config.host = this;
			
                    if (this.hasPlugin(name)) {
                        // ��������
                        if (this[name].set) {
                            this[name].set(config);
                        }
                    } else {
                        // �������ʵ��
                        this[name] = new Plugin(config);
                        this._plugins[name] = Plugin;
                    }
                }
            }
            return this;
        },

        /**
         * ���ж�غ��� 
         *
         * @method uninstall
         * @param {String | Function} Plugin Ҫж�ز���Ķ��� ������Ϊ�գ���ж�����в��
         * @return {Base} �����������������
         * @chainable
         */
        uninstall: function(Plugin) {
			
			if (!this._plugins) return this;
			 
            var name = Plugin, 
                plugins = this._plugins;
            
            if (Plugin) {
                if (isFunction(Plugin)) {
                    name = Plugin.Name;
                    if (name && (!plugins[name] || plugins[name] !== Plugin)) {
                        name = null;
                    }
                }
        
                if (name) {
                    if (this[name]) {
                        if (this[name].destory) {
                            this[name].destory();
                        }
                        delete this[name];
                    }
                    if (plugins[name]) {
                        delete plugins[name];
                    }
                }
            } else {
                for (name in this._plugins) {
                    if (this._plugins.hasOwnProperty(name)) {
                        this.uninstall(name);
                    }
                }
            }
            return this;
        },

        /**
         * ������Ƿ��Ѿ�����������д���
         *
         * @method hasPlugin
         * @param {String} name �����Name����
         * @return {Plugin} �����򷵻�pluginʵ��������undefined
         */
        hasPlugin : function(name) {
			
			if (!this._plugins) return false;
			
            return (this._plugins[name] && this[name]);
        }
		
	});
	
	
	var toString = {}.toString,
        isFunction = function( it ){
            return toString.call( it ) === '[object Function]';
        },
		isArray = Array.isArray || function(it) {
			return toString.call(it) === '[object Array]'
		};
		
	return PluginHost;

} );
