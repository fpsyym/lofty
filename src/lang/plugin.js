/**
 * @module lofty/lang/plugin
 * @author terence.wangt
 * @date 20130701
 * */
 
define( 'lofty/lang/plugin', ['lofty/lang/class', 
							  'lofty/lang/base',
							  'lofty/lang/aop'], 
    function( Class, Base, Aop){
	'use strict';
    
	var Plugin = Class( Base, {
		
        /**
         * �����¼��������� ���� AOP ���뺯�����������
         */
        _handles: null,

        /**
         * ��ʼ������
         *
         * @method init
         * @param {Object} config ������ò�����ֵ��
         */
        init : function(config) {
            this._handles = [];
			Base.prototype.init.apply(this, arguments);
        },

        /**
         * ������ٺ���
         * �Ƴ����е��¼�������������AOP���뺯��
         * @method destructor
         */
        destory: function() {
            if (this._handles) {
                for (var i = 0, l = this._handles.length; i < l; i++) {
                   this._handles[i] && this._handles[i].detach && this._handles[i].detach();
                }
            }
        },

		/**
         * ����������ķ��� "֮ǰ" �������ĺ���������ĺ�������ִ�С�
		 * ������ĺ��� return false������������ķ���������ִ�С� �൱�ڸ�����������ķ���
         *
         * @method beforeHost
         *
         * @param strMethod {String} ���������ϵ�ĳ����������
         * @param fn {Function} Ҫ������ִ�еķ���������strMethod֮ǰִ�У���fn����false����strMethod�����ᱻ����ִ�С�
         * @param context {Object} optional Ҫ���뷽����ִ����
         * @return handle {EventHandle} ����AOP�¼����
         */
        beforeHost: function(strMethod, fn, context) {
            var host = this.get("host"), handle;

            if (strMethod in host) { // method
				handle = Aop.before(this.get("host"), strMethod, fn, context || this);
				this._handles.push(handle);
            }
            return handle;
        },
		
        /**
         * ����������ķ��� "֮��" �������ĺ�������������ķ�������ִ�С�
         *
         * @method afterHost
         *
         * @param strMethod {String} ���������ϵ�ĳ����������
         * @param fn {Function} Ҫ������ִ�еķ���������strMethod֮��ִ��
         * @param context {Object} optional Ҫ���뷽����ִ����
         * @return handle {EventHandle} ����AOP�¼����
         */
        afterHost: function(strMethod, fn, context) {
            var host = this.get("host"), handle;

            if (strMethod in host) { // method
				handle = Aop.after(this.get("host"), strMethod, fn, context || this);
				this._handles.push(handle);
            } 
            return handle;
        },

        /**
         * ��������������Զ����¼�
         *
         * ���ж��ʱ�������¼�Ҳ��������
         * 
         * @method onHostEvent
         * @param {String | Object} event �¼�����
         * @param {Function} fn �����ص�����
         * @param {Object} context �����ص�������ִ����Ĭ��Ϊpluginʵ������
         * @return handle {EventHandle} ����detach�¼����
         */
        onHostEvent : function(event, fn, context) {
            var handle = this.get("host").on(event, fn, context || this);
            this._handles.push(handle);
            return handle;
        }
		
	});
	
	/**
     *
     * @property Name
     * @type String     ������ ���������ÿ��pluginʵ��ʱ��Ҫ�Զ��壬���Ҳ����ظ� ������
     * @static
     */
    Plugin.Name = 'plugin';
	
	
	return Plugin;

} );
