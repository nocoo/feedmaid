/*
    feedmaid
    @copyright 2012  Zheng Li <lizheng@lizheng.me>
    @github https://github.com/nocoo/express-spa
    @license MIT
*/

exports.login = function(req, res) {
    res.render('login');
};

exports.register = function(req, res) {
    res.render('register');
};

exports.applist = function(req, res) {
    res.render('applist');
};

exports.appadd = function(req, res) {
    res.render('appadd');
};

exports.datalist = function(req, res) {
    res.render('datalist', { 'appid': req.params.appid });
};
