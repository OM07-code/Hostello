const express = require('express');
const router = express.Router();
const complaintController = require('../controllers/complaint.controller');
const { requireAuth } = require('../middleware/auth.middleware');

router.use(requireAuth);

router.get('/', complaintController.getComplaints);
router.post('/', complaintController.createComplaint);

module.exports = router;
