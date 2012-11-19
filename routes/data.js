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

exports.check_token = function (token, callback) {
    var cobj = entity.entity_get('session', { 'token': token }, function(code, extra) {
        if (!extra || extra == null) {
            if (callback && typeof(callback) === 'function') {
                callback(false);
            }

            return;
        }

        var create_time = extra['create_at_timestamp'];
        var check_time = extra['check_at_timestamp'];

        var ctime = check_time ? check_time : create_time;
        var time = (new Date).getTime();

        if (ctime) {
            // Never been checked.
            if (time - ctime > tools.SESSION_MAX_AGE) {
                // expired, delete this session.
                entity.entity_delete('session', { 'token': token }, function(code, extra) {
                    if (callback && typeof(callback) === 'function') {
                        callback(false);
                    }
                });
            } else {
                // valid, update check time.
                extra['check_at_timestamp'] = time;
                console.log(extra);
                entity.entity_update('session', extra, function(code, extra) {
                    console.log(extra);
                    if (callback && typeof(callback) === 'function') {
                        callback(true);
                    }
                });
            }
        } else {
            if (callback && typeof(callback) === 'function') {
                callback(false);
            }
        }
    });
};

exports.add = function(req, res) {
    var data = {
        'token': req.params.token || req.body.token,
        'id': req.params.id || req.body.id,
        'name': req.params.name || req.body.name,
        'value': req.params.value || req.body.value
    };

    return store_data(
        data.token,
        data.id,
        data.name,
        data.value,
        tools.reqinfo(req),
        function(result) {
            res.jsonp(result);
        }
    );
};

var store_data = function (token, id, name, value, info, callback) {
    if (token && id && name && value) {

        // console.log('+ Data request: token=' + token + ', id=' + id);
        // console.log(name);
        // console.log(value);

        exports.check_token(token, function(is_token_ok) {
            if (is_token_ok) {
                // insert data

                entity.entity_add('data', {
                    'token': token,
                    'id': id,
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
