const express = require('express');
const { CreateShippingOrderController, GetListofShippingController } = require('./shipping.controller');
const router = express.Router();

router.post('/shipping/orders' , CreateShippingOrderController)
router.get('/shipping/products' , GetListofShippingController)

module.exports = router;
