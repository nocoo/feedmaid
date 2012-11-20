/*
    feedmaid
    @copyright 2012  Zheng Li <lizheng@lizheng.me>
    @github https://github.com/nocoo/feedmaid
    @license MIT
*/

define(function(require, exports, module) {
    exports.ready = function() {
        $(document).ready(function() {
            var form = document.forms.form_add;
            form.onsubmit = function() {
                $.post('/api/app/add', {
                    'appname': form.appname.value,
                    'appid': form.appid.value
                }, function(back) {
                    if (back && back.code) {
                        if (back.code === 400) {
                            alert('App ID already been taken, please try another one.');
                        } else if (back.code === 200) {
                            window.location.href = '/app/list';
                        } else {
                            window.location.href = '/';
                        }
                    }
                });

                return false;
            };
        });
    };
});
