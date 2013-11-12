/*!!cmd:compress=true*/
/*!!cmd:jsCompressOpt=["--disable-optimizations"]*/

/*
 * author shiwei.dengsw
 * date 2013-09-24
 * dependence: jQuery
 * ȡ������ʱ����أ�ּ��ͳһά���������Ƶ��߼�
 */

define('lofty/alicn/now/1.0/now', ['jquery'], function ($) {
    'use strict';

    var API = 'http://wholesale.1688.com/json/get_server_time.jsx';

    var Now = {
        /**
         * ���첽��������ȡ��������ǰʱ��
         * @param {Function} callback(serverTimeMillis) �ɹ���ȡʱ���Ĺ��ص��ĺ���������������һ����
         * �� serverTimeMillis ������Number�ͣ��Ƿ�������ǰʱ��ĺ����ʾ��ʽ�������ȡʱ��ʧ�ܣ���
         * serverTimeMillis Ϊ null ��
         */
        now: function (callback) {
            $.ajax({
                url: API,
                dataType: 'jsonp'
            }).done(function (result) {
                var data;
                var time = null;
                if ( typeof result === 'object' && result && result.success === 'true' ) {
                    data = result.data;
                    time = +data.serverTimeMillis;
                }
                callback(time);
            }).fail(function () {
                callback(null);
            });
        },
        // ��¶һ��ֻ����api��ʵ��ַ���û����Ա�����������Ի�ʹ��
        getAPI: function () {
            return API;
        }
    };

    return Now;
});


