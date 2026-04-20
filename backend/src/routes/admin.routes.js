const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');

// Students
router.get('/students', adminController.getStudents);
router.post('/students', adminController.createStudent);
router.delete('/students/:id', adminController.deleteStudent);

// Rooms
router.get('/rooms', adminController.getRooms);
router.post('/rooms', adminController.createRoom);
router.delete('/rooms/:id', adminController.deleteRoom);

// Complaints
router.get('/complaints', adminController.getComplaints);
router.put('/complaints/:id', adminController.updateComplaintStatus);

// Notices
router.get('/notices', adminController.getNotices);
router.post('/notices', adminController.createNotice);
router.delete('/notices/:id', adminController.deleteNotice);

module.exports = router;
