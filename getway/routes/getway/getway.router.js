const express = require('express');
const {CreateOrderGetWayController} = require('./getway.controller');
const router = express.Router();


router.post('/orders', CreateOrderGetWayController);

module.exports = router;