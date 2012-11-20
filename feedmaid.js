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
    tools = require('./routes/tools'),
    http = require('http'),
    path = require('path');

var app = express();

app.use(express.cookieParser());
app.use(express.session({ secret: '39b9ecaa2002201cd2568067b193b4e1f029ef32772fd677db8b84a4abef69f3', maxAge: tools.SESSION_MAX_AGE }));

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

/* Client APIs. */
app.get('/v', data.version);
app.get('/a/:token/:deviceid/:appid/:name/:value', data.add);
app.post('/a', data.add);

/* Web pages */
app.get('/', page.login);
app.get('/register', page.register);
app.get('/app/list', page.applist);
app.get('/app/add', page.appadd);
app.get('/data/list/:appid', page.datalist);

/* Web APIs */
app.post('/api/register', api.register);
app.post('/api/login', api.login);
app.post('/api/app/list', api.applist);
app.post('/api/app/add', api.appadd);
app.post('/api/data/list', api.datalist);

http.createServer(app).listen(app.get('port'), function() {
    console.log('feedmaid server listening on port ' + app.get('port'));
});
