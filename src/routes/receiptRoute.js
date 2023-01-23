const express = require('express');
const { getReceipts, addReceipt, deleteReceipt, getFixedCounters } = require('../controllers/receiptController');
const { Protect } = require('../middlewares/security');

const receiptRoute = express.Router();

receiptRoute.get( '/get', Protect, getReceipts );
receiptRoute.get( '/fixedcounters', Protect, getFixedCounters );
receiptRoute.post( '/add', Protect, addReceipt );
receiptRoute.delete( '/delete', Protect, deleteReceipt );

module.exports = { receiptRoute };