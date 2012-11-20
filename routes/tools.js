/*
    feedmaid
    @author  Zheng Li <lizheng@lizheng.me>
    @license MIT
    @version 0.1.0
*/

var mongodb = require('mongodb'),
    entity = require('./entity');

// feedmaid version.
exports.VERSION = '0.1.0';

// Mongodb port
exports.PORT = 17755;

// session max age, in ms
exports.SESSION_MAX_AGE = 600000;

// entities per page
exports.PER_PAGE_COUNT = 20;

// timeout
exports.TIMEOUT = 5000;

// GUID.
exports.guid = function(type) {
    var S4 = function() { return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1); };

    if (type === 'long') {
        return (S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4());
    } else {
        return (S4() + S4());
    }
};

exports.dbopen = function(callback) {
    var db = new mongodb.Db(
        'feedmaid',
        new mongodb.Server(
            'localhost',
            27017,
            { 'auto_reconnect': true, 'poolSize': 20 }
        ),
        { 'safe': true }
    );
    db.open(function(error, db) {
        if (error) {
            return callback(error);
        }

        return callback(undefined, db);
    });
};

// TimeStamp.
exports.timestamp = function(d) {
    var date;
    if (d) { date = d; }
    else { date = new Date(); }

    var yyyy = date.getFullYear(),
        mm = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1),
        dd = date.getDate() < 10 ? '0' + date.getDate() : date.getDate(),
        hh = date.getHours() < 10 ? '0' + date.getHours() : date.getHours(),
        min = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes(),
        ss = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();

    return yyyy + '-' + mm + '-' + dd + ' ' + hh + ':' + min + ':' + ss;
};

exports.check_token = function (token, callback) {
    var cobj = entity.entity_get('session', { 'token': token }, function(code, extra) {
        extra = extra[0];

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
            if (time - ctime > exports.SESSION_MAX_AGE) {
                // expired, delete this session.
                entity.entity_delete('session', { 'token': token }, function(code, extra) {
                    if (callback && typeof(callback) === 'function') {
                        callback(false);
                    }
                });
            } else {
                // valid, update check time.
                extra['check_at_timestamp'] = time;
                //console.log(extra);
                entity.entity_update('session', extra, function(code, extra) {
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

exports.log = function(message, extra) {
    var result = ['+ [' + exports.timestamp() + '] ', message];
    if (extra) {
        result.push(', extra: ');
        result.push(JSON.stringify(extra));
    }

    result.push('.');

    // Print to console.
    console.log(result.join(''));

    // Add to database.
    exports.dbopen(function(error, db) {
        if (!error) {
            db.collection('logs', function(error, collection) {
                var doc = {
                    'time': (new Date()).getTime(),
                    'time_string': exports.timestamp(),
                    'message': message,
                    'extra': extra
                };

                collection.insert(doc, { safe: true }, function(error, result) {
                    db.close();
                });
            });
        } else {
            console.log('- MongoDB Error: ' + error);
        }
    });
};

exports.reqinfo = function(req) {
    var ip_address;
    try { ip_address = req.headers['x-forwarded-for']; }
    catch (error) { ip_address = req.connection.remoteAddress; }

    return {
        'ua': req.headers['user-agent'] || 'N/A',
        'ip' : ip_address || 'N/A'
    };
};

exports.json_result = function(code, message, extra) {
    var result = {
        'code': code,
        'message': message,
        'extra': extra
    };

    if (!result.message) {
        switch (result.code) {
            case 200: {
                result.message = 'OK.';
                break;
            }

            case 400: {
                result.message = 'Bad Request.';
                break;
            }
            case 401: {
                result.message = 'Unauthorized.';
                break;
            }
            case 403: {
                result.message = 'Forbidden.';
                break;
            }

            case 500: {
                result.message = 'Internal Server Error.';
                break;
            }
            case 501: {
                result.message = 'Not Implemented.';
                break;
            }
            case 504: {
                result.message = 'Gateway Timeout.';
                break;
            }
            case 506: {
                result.message = 'Internal Server Error: DB Error.';
                break;
            }

            default: {
                result.message = 'Unknown.';
                break;
            }
        }
    }

    return result;
};
