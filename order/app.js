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
const { GetwayCreateOrderService } = require('./routes/sales/sales.services.js');
const {  UpdateStatusOfOrderController } = require('./routes/sales/slaes.controller.js');

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
app.use('/api/v1', require('./routes/sales/sales.router.js'));

app.get('/', (req, res) => {
  res.send('Hello World!');
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

RabbitConnect.subscribeToQueue("sales.order_placed", async (message, channel) => {
  console.log('message: ', message);
  try {
    console.log('Received message:', JSON.parse(message));

    const { order_id, products, customer_id, billing_account_id, billing_address, shipping_address } = JSON.parse(message);
    const data = { order_id, products, customer_id, billing_account_id, billing_address, shipping_address };

    const results = await GetwayCreateOrderService(data);
    const price = results.price;
    console.log('price: ', price);

    console.log('Order created successfully:', results);
    const billingData = { customer_id, billing_account_id, billing_address, price };
    RabbitConnect.publishToQueue("billing.order_billed", JSON.stringify(billingData), (publishError) => {
      if (publishError) {
        console.log('Error publishing to orderBilled queue:', publishError);
      } else {
        console.log('Message published to orderBilled queue');
      }
    });

    channel?.ack(message);
  } catch (error) {
    console.error('Error processing RabbitMQ message:', error);
    if (channel) {
      channel.nack(message, false, false);
    }
  }
});

RabbitConnect.subscribeToQueue("billing.payment_failed", async (message, channel) => {
  try {
    const { customer_id, billing_account_id, billing_address, price, error } = JSON.parse(message);

    console.log(`Payment failed for customer ${customer_id}`);
    UpdateStatusOfOrderController({ customer_id, billing_account_id, billing_address, price, status: 'PaymentFailed' });

    channel?.ack(message);
  } catch (error) {
    console.error('Error processing billing.payment_failed message:', error);
    if (channel) {
      channel.nack(message, false, false);
    }
  }
});

RabbitConnect.subscribeToQueue("billing.order_refunded", async (message, channel) => {
  try {
    const { customer_id, billing_account_id,billing_address, price } = JSON.parse(message);

    console.log(`Refunded order for customer ${customer_id}. Refund amount: ${price}`);
    UpdateStatusOfOrderController({ customer_id, billing_account_id,billing_address, price, status: 'PaymentRefund' });

    channel?.ack(message);
  } catch (error) {
    console.error('Error processing billing.order_refunded message:', error);
    if (channel) {
      channel.nack(message, false, false);
    }
  }
});

RabbitConnect.subscribeToQueue("shipping.shipping_label_created", async (message, channel) => {
  try {
    const { customer_id, billing_account_id, billing_address, price } = JSON.parse(message);
    console.log('Order is move to Shiped Changing status in order table ', message);

    UpdateStatusOfOrderController({ customer_id, billing_account_id, billing_address, price,status:'OrderBilled' });

    channel?.ack(message);
  } catch (error) {
    console.error('Error processing shipping.shipping_label_created message:', error);
    if (channel) {
      channel.nack(message, false, false);
    }
  }
});

RabbitConnect.connect();

const PORT = '7000';
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;