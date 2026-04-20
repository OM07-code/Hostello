const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');

// User Routes
router.get('/fees', paymentController.getFees);
router.post('/pay', paymentController.payFee);

// Admin Routes
router.post('/assign', paymentController.assignFee);
router.get('/admin/all', paymentController.getAllPayments);

module.exports = router;
