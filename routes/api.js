/*
    feedmaid
    @copyright 2012  Zheng Li <lizheng@lizheng.me>
    @github https://github.com/nocoo/express-spa
    @license MIT
*/

var entity = require('./entity.js'),
    tools = require('./tools.js');

exports.register = function(req, res) {
    var data = {
        'username': req.body.username,
        'password': req.body.password,
        'email': req.body.email,
        'type': 'normal'
    };

    console.log(data);

    // Check username.
    entity.entity_get('user', { 'username': data.username }, function(code, result) {
        if (code === 200 && result) {
            return res.json(tools.json_result(400, undefined));
        }
    });

    // Insert new user.
    entity.entity_add('user', data, function (code, extra) {
        return res.json(tools.json_result(code, undefined, extra));
    });
};

exports.login = function(req, res) {
    var data = {
        'username': req.body.username,
        'password': req.body.password
    };

    console.log(data);

    // Check login.
    entity.entity_get('user', { 'username': data.username, 'password': data.password }, function(code, result) {
        if (code === 200 && result) {
            if (result.type === 'normal' || result.type === 'admin') {
                return res.json(tools.json_result(200));
            } else {
                return res.json(tools.json_result(401));
            }
        } else {
            return res.json(tools.json_result(401));
        }
    });
};
