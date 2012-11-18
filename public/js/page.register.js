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
            var form = document.forms.form_register;
            form.onsubmit = function() {
                $.post('/api/register', {
                    'username': form.username.value,
                    'password': $.sha256(form.password.value),
                    'email': form.email.value
                }, function(back) {
                    if (back && back.code) {
                        if (back.code === 400) {
                            alert('This username has already been taken. Try another one please.');
                        } else if (back.code === 200) {
                            alert('Your account has been created. Redirecting you to login page.');
                            window.location.href = '/';
                        }
                    }
                });

                return false;
            };
        });
    };
});