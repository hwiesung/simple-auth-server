var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes');
var authRouter = require('./routes/auth');
var healthRouter = require('./routes/health');
var config = require('config');

var app = express();

var sequelize = require('./database').db.sequelize;
sequelize.sync().then(()=>{
  console.log('db connected');
}).catch((err)=>{
  console.log(err)
});



app.set('jwt-secret', config.jwt.secret_key);
app.set('jwt-refresh-secret', config.jwt.refresh_secret_key);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(__dirname + '/public'));
app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/health', healthRouter);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
