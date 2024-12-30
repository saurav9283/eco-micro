const express = require('express');
const { CreateSalesOrderController, GetListProductsWithPriceController } = require('./slaes.controller');
const router = express.Router();

router.post('/sales/orders', CreateSalesOrderController)
router.get('/sales/products' , GetListProductsWithPriceController)
// router.get('/sales/orders' , GetListOfOrdersController)

module.exports = router;