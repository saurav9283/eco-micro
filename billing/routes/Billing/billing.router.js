const express = require('express');
const router = express.Router();
const { CreateBillingController } = require('./billing.controller');

router.post('/billing/orders', CreateBillingController);

module.exports = router;
