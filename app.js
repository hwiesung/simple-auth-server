var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var winston = require('winston'),
    expressWinston = require('express-winston');

let logger = require('./common/logger');

var indexRouter = require('./routes');
var authRouter = require('./routes/auth');
var healthRouter = require('./routes/health');
var config = require('config');

var app = express();

var sequelize = require('./database').db.sequelize;
sequelize.sync().then(()=>{
  logger.info('db connected');
}).catch((err)=>{
  logger.error(err)
});



app.set('jwt-secret', config.jwt.secret_key);
app.set('jwt-refresh-secret', config.jwt.refresh_secret_key);

app.use(expressWinston.logger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/access_log.log'})
  ],
  format: winston.format.json(),
  meta: true, // optional: control whether you want to log the meta data about the request (default to true)
  msg: "HTTP {{req.method}} {{req.url}}", // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
  expressFormat: true, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
  colorize: false, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
  responseWhitelist: ['body']
}));

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
