/*
    feedmaid
    @copyright 2012  Zheng Li <lizheng@lizheng.me>
    @github https://github.com/nocoo/express-spa
    @license MIT
*/

exports.version = function(req, res) {
    return res.jsonp({
        'name': 'feedmaid',
        'version': '0.0.1'
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
        function(result) {
            res.jsonp(result);
        }
    );
};

var store_data = function (token, id, name, value, callback) {
    var result = { 'code': 200, 'message': 'OK' };

    if (token && id && name && value) {

        console.log('+ Data request: token=' + token + ', id=' + id);
        console.log(name);
        console.log(value);

        result = { 'code': 200, 'message': 'OK' };
    } else {
        result = { 'code': 400, 'message': 'Bad Request' };
    }

    if (callback && typeof(callback) === 'function') {
        return callback(result);
    }
};