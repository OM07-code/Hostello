const express = require('express');
const router = express.Router();
const allocationController = require('../controllers/allocation.controller');

router.post('/seed', allocationController.seedData);
router.get('/rooms', allocationController.getRooms);
router.get('/preferences', allocationController.getPreferences);
router.post('/preferences', allocationController.addPreference);

router.post('/gemini-run', allocationController.runGeminiAllocation);
router.post('/reset', allocationController.resetAllocations);

module.exports = router;
