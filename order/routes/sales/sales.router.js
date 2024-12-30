const express = require('express');
const { CreateSalesOrderController } = require('./slaes.controller');
const router = express.Router();

router.post('/sales/orders', CreateSalesOrderController)

module.exports = router;