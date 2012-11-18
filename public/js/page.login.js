/*
    feedmaid
    @copyright 2012  Zheng Li <lizheng@lizheng.me>
    @github https://github.com/nocoo/feedmaid
    @license MIT
*/

define(function(require, exports, module) {
    exports.ready = function() {
        $(document).ready(function() {
            // Events.
            $('#btn_register').on('click', function() {
                window.location.href = '/register';
                return false;
            });

            var form = document.forms.form_login;
            form.onsubmit = function() {
                $.post('/api/login', {
                    'username': form.username.value,
                    'password': $.sha256(form.password.value)
                }, function(back) {
                    if (back && back.code) {
                        console.log(back)
                    }
                });

                return false;
            };
        });
    };
});