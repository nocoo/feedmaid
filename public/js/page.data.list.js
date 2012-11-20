/*
    feedmaid
    @copyright 2012  Zheng Li <lizheng@lizheng.me>
    @github https://github.com/nocoo/feedmaid
    @license MIT
*/

define(function(require, exports, module) {
    exports.ready = function(appid) {
        $(document).ready(function() {
            $.post('/api/data/list', { 'appid': appid }, function(back) {
                if (back.code === 401) {
                    window.location.href = '/';
                } else if (back.code === 404) {
                    alert('App not found.');
                    window.location.href = '/app/list';
                } else {
                    var cache = [], item;

                    if (back.extra && back.extra.length > 0) {
                        for (var i = 0, len = back.extra.length; i < len; ++i) {
                            item = back.extra[i];

                            cache.push('<tr>');
                            cache.push('<td>' + item.create_at + '</td>');
                            cache.push('<td>' + item.deviceid + '</td>');
                            cache.push('<td>' + item.name + '</td>');
                            cache.push('<td>' + item.value + '</td>');
                            cache.push('<td></td>');
                            cache.push('</tr>');
                        }
                    }

                    $('#main_table tbody').html(cache.join(''));
                }
            });
        });
    };
});
