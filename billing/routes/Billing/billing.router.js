const express = require('express');
const router = express.Router();
const { CreateBillingController, GetListBalanceAccountController } = require('./billing.controller');

router.post('/billing/orders', CreateBillingController);
router.get('/billing/accounts' , GetListBalanceAccountController);

module.exports = router;
