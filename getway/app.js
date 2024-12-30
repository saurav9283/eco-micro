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
var GetWayRouter = require('./routes/getway/getway.router');

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
app.use('/api/v1' , GetWayRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

app.get('/', (req, res) => {
  res.send('Api working for APi getWay')
})

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// RabbitConnect.subscribeToQueue("order-accept", async(message) => {
//   try {
//     console.log('Received message: for user dashboard order accept', JSON.parse(message));
//     const { user_id, providerName } = JSON.parse(message);
//     await updateOnOrderNotificationService(user_id, providerName);
//   } catch (error) {
//     console.error('Error processing RabbitMQ message:', error);
//   }
// })

RabbitConnect.connect();

const post = '6000';

server.listen(post, () => {
  console.log(`Server is running on port ${post}`)
})

module.exports = app;
