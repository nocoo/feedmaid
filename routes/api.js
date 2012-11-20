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

    //console.log(data);

    // Check username.
    entity.entity_get('user', { 'username': data.username }, function(code, result) {
        result = result[0];
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

    //console.log(data);

    // Check login.
    entity.entity_get('user', { 'username': data.username, 'password': data.password }, function(code, result) {
        result = result[0];

        if (code === 200 && result) {
            if (result.type === 'normal' || result.type === 'admin') {
                var token = tools.guid();
                var info = tools.reqinfo(req);

                entity.entity_add('session', { 'token': token, 'info': info }, function(code, extra) {
                    if (code === 200) {
                        // write to session
                        req.session.token = token;
                        req.session.username = result.username;

                        return res.json(tools.json_result(200, undefined, { 'username': result.username }));
                    } else {
                        return res.json(tools.json_result(500));
                    }
                });
            } else {
                return res.json(tools.json_result(401));
            }
        } else {
            return res.json(tools.json_result(401));
        }
    });
};

exports.applist = function(req, res) {
    var token = req.session.token;
    var username = req.session.username;

    if (!token) {
        // login expired.
        return res.json(tools.json_result(401));
    } else {
        tools.check_token(token, function(is_valid) {
            if (!is_valid) {
                // something went wrong, token is not valid in database.
                return res.json(tools.json_result(401));
            } else {
                entity.entity_get('app', { 'username': username }, function(code, extra) {
                    res.json(tools.json_result(code, undefined, extra));
                });
            }
        });
    }
};

exports.appadd = function(req, res) {
    var data = {
        'name': req.body.appname,
        'id': req.body.appid
    }, token = req.session.token;

    if (!token) {
        // login expired.
        return res.json(tools.json_result(401));
    } else {
        tools.check_token(token, function(is_valid) {
            if (!is_valid) {
                // something went wrong, token is not valid in database.
                return res.json(tools.json_result(401));
            } else {
                // check app id.
                entity.entity_get('app', { 'id': data.id }, function(code, extra) {
                    if (extra && extra.length > 0) {
                        return res.json(tools.json_result(400));
                    } else {
                        // insert new app.
                        data.username = req.session.username;
                        entity.entity_add('app', data, function(code, extra) {
                            if (code === 200) {
                                return res.json(tools.json_result(200, undefined, extra));
                            } else {
                                return res.json(tools.json_result(500));
                            }
                        });
                    }
                });
            }
        });
    }
};

exports.datalist = function(req, res) {
    var appid = req.body.appid;
    var token = req.session.token;
    var username = req.session.username;

    if (!token) {
        // login expired.
        return res.json(tools.json_result(401));
    } else {
        tools.check_token(token, function(is_valid) {
            if (!is_valid) {
                // something went wrong, token is not valid in database.
                return res.json(tools.json_result(401));
            } else {
                // check app ownership
                entity.entity_get('app', { 'id': appid, 'username': username }, function(code, extra) {
                    if (extra && extra.length === 1) {
                        // return data list
                        entity.entity_get('data', { 'appid': appid }, function(code, extra) {
                            res.json(tools.json_result(code, undefined, extra));
                        });
                    } else {
                        res.json(tools.json_result(404));
                    }
                });
            }
        });
    }
};
