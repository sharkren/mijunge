var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
// Express를 통한  request 처리 검증 라이브러리 추가
var expressValidator = require('express-validator');
var routes = require('./routes/index');
var users = require('./routes/users');
var connection = require('express-myconnection');
var mysql = require('mysql');

/* global module */
//var global_module = require('./public/javascripts/global');

var app = express();
//app.use('global_module', global_module);

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
