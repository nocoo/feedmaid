/*
    feedmaid
    @copyright 2012  Zheng Li <lizheng@lizheng.me>
    @github https://github.com/nocoo/express-spa
    @license MIT
*/

var express = require('express'),
    data = require('./routes/data'),
    api = require('./routes/api'),
    page = require('./routes/page'),
    http = require('http'),
    path = require('path');

var app = express();

app.configure(function() {
    app.set('port', process.env.PORT || 60097);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function() {
    app.use(express.errorHandler());
});

app.get('/v', data.version);
app.get('/a/:token/:id/:name/:value', data.add);
app.post('/a', data.add);

app.get('/', page.login);
app.get('/register', page.register);

http.createServer(app).listen(app.get('port'), function() {
    console.log('feedmaid server listening on port ' + app.get('port'));
});
