require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var http = require('http');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require("cors");
const RabbitConnect = require('./utils/Rabbitmq.js');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var CreateShippingRouter = require('./routes/Shipping/shipping.router.js');

var app = express();
const server = http.createServer(app);
app.use(cors("*"));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/v1', CreateShippingRouter);

app.get('/', (req, res) => {
  res.send('Hello World!')
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

const PORT = '9000';
server.listen(PORT, () => {
  console.log(`Billing server is running on port ${PORT}`);
});

module.exports = app;
