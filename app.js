var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

/* method가 다른 동일한 api 허용 모듈 추가 */
// ex) get '/edit/(:id)'
//     put '/edit/(:id)'
//     delete '/edit/(:id)'
var methodOverride = require('method-override');

/* mysql connection module */
var connection = require('express-myconnection');
var mysql = require('mysql');

/* Express를 통한  request unit 테스트 추가 */
var expressValidator = require('express-validator');
/* 응답 본문의 사이즈를 줄여 앱의 속도를 높이기 위한 압축 미들웨어 추가 */
var compression = require('compression');

/* app에서 사용할 router 선언 */
var routes = require('./routes/index');
var users = require('./routes/users');


var app = express();
/* compression을 app에 추가 */
app.use(compression());
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/* expressValidator 모듈 사용 추가 */
app.use(expressValidator());

/* method override를 위한 사용 세팅 */
app.use(methodOverride(function(req, res){
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    var method = req.body._method;
    delete req.body._method;
    return method;
  }
}));

// mysql config
app.use(
    connection(mysql,{
        host: '127.0.0.1',
        user: 'map_user', // your mysql user
        password : 'map_user', // your mysql password
        port : 3306, //port mysql
        database:'mijunge' // your database name
    },'pool') //or single
);

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: err
  });
});

module.exports = app;
