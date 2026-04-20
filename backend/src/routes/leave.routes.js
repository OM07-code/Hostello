const express = require('express');
const router = express.Router();
const leaveController = require('../controllers/leave.controller');

// User Routes
router.post('/apply', leaveController.applyLeave);
router.get('/my', leaveController.getMyLeaves);

// Admin Routes
router.get('/all', leaveController.getAllLeaves);
router.put('/update', leaveController.updateLeaveStatus);

module.exports = router;
