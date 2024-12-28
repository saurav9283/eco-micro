const express = require('express');
const router = express.Router();
const { GetwayCreateOrderService } = require('./sales.services');
const { GetListOfOrderListController } = require('./slaes.controller');

router.post('/sales/orders', GetwayCreateOrderService)
// router.get('/sales/products' , GetListOfOrderListController)
module.exports = router;