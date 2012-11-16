/*
    feedmaid
    @copyright 2012  Zheng Li <lizheng@lizheng.me>
    @github https://github.com/nocoo/express-spa
    @license MIT
*/

exports.index = function(req, res){
  res.render('index', { title: 'Hello World' });
};
