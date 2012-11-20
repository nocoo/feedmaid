/*
    feedmaid
    @copyright 2012  Zheng Li <lizheng@lizheng.me>
    @github https://github.com/nocoo/feedmaid
    @license MIT
*/

define(function(require, exports, module) {
    exports.ready = function() {
        $(document).ready(function() {
            $.post('/api/app/list', {}, function(back) {
                if (back.code === 401) {
                    window.location.href = '/';
                } else {
                    var cache = [], item;

                    if (back.extra && back.extra.length > 0) {
                        for (var i = 0, len = back.extra.length; i < len; ++i) {
                            item = back.extra[i];

                            cache.push('<tr>');
                            cache.push('<td>' + item.id + '</td>');
                            cache.push('<td>' + item.name + '</td>');
                            cache.push('<td>' + item.create_at + '</td>');
                            cache.push('<td>' + item.username + '</td>');
                            cache.push('<td><a href="/data/list/' + item.id  + '">Data</a></td>');
                            cache.push('</tr>');
                        }
                    }

                    $('#main_table tbody').html(cache.join(''));
                }
            });
        });
    };
});
