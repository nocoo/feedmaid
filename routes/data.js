/*
    feedmaid
    @copyright 2012  Zheng Li <lizheng@lizheng.me>
    @github https://github.com/nocoo/express-spa
    @license MIT
*/

var entity = require('./entity'),
    tools = require('./tools');

exports.version = function(req, res) {
    var token = tools.guid();
    var info = tools.reqinfo(req);

    entity.entity_add('session', { 'token': token, 'info': info }, function(code, extra) {
        return res.jsonp({
            'name': 'feedmaid',
            'version': '0.0.1',
            'token': token
        });
    });
};

exports.add = function(req, res) {
    var data = {
        'token': req.params.token || req.body.token,
        'deviceid': req.params.deviceid || req.body.deviceid,
        'appid': req.params.appid || req.body.appid,
        'name': req.params.name || req.body.name,
        'value': req.params.value || req.body.value
    };

    return store_data(
        data.token,
        data.deviceid,
        data.appid,
        data.name,
        data.value,
        tools.reqinfo(req),
        function(result) {
            res.jsonp(result);
        }
    );
};

var store_data = function (token, deviceid, appid, name, value, info, callback) {
    if (token && deviceid && appid && name && value) {

        // console.log('+ Data request: token=' + token + ', id=' + id);
        // console.log(name);
        // console.log(value);

        tools.check_token(token, function(is_token_ok) {
            if (is_token_ok) {
                // check appid
                entity.entity_get('app', { 'id': appid }, function(code, extra) {
                    if (extra && extra.length === 0) {
                        return callback(tools.json_result(404));
                    } else {
                        // insert data
                        entity.entity_add('data', {
                            'token': token,
                            'appid': appid,
                            'deviceid': deviceid,
                            'name': name,
                            'value': value,
                            'info': info
                        }, function(code, extra) {
                            if (code === 200) {
                                if (callback && typeof(callback) === 'function') {
                                    return callback(tools.json_result(200));
                                }
                            } else {
                                if (callback && typeof(callback) === 'function') {
                                    return callback(tools.json_result(506));
                                }
                            }
                        });
                    }
                });
            } else {
                // session is expired.
                if (callback && typeof(callback) === 'function') {
                    return callback(tools.json_result(401));
                }
            }
        });
    } else {
        if (callback && typeof(callback) === 'function') {
            return callback(tools.json_result(400));
        }
    }
};
