const express = require('express');
const { CreateShippingOrderController } = require('./shipping.controller');
const router = express.Router();

router.post('/shipping/orders' , CreateShippingOrderController)

module.exports = router;
