const User = require('../models/User');
const Room = require('../models/Room');
const Complaint = require('../models/Complaint');
const Notice = require('../models/Notice');
const { logAdminAction, sendNotification } = require('../utils/logger');

const buildFilter = (req, searchFields) => {
  const filter = { hostelId: req.hostelId }; // Enforce scope
  if (req.query.search) {
     const regex = new RegExp(req.query.search, 'i');
     filter.$or = searchFields.map(f => ({ [f]: regex }));
  }
  return filter;
}

// --------- STUDENTS ---------
exports.getStudents = async (req, res) => {
  try {
    const filter = { ...buildFilter(req, ['name', 'email']), role: 'Student' };
    const students = await User.find(filter);
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch students' });
  }
};

exports.createStudent = async (req, res) => {
  try {
    const student = new User({ ...req.body, role: 'Student', hostelId: req.hostelId });
    await student.save();
    await logAdminAction(req.user._id, 'CREATED_STUDENT', 'User', student._id);
    res.json(student);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create student' });
  }
};

exports.deleteStudent = async (req, res) => {
  try {
    const s = await User.findOneAndDelete({ _id: req.params.id, hostelId: req.hostelId });
    if (s) await logAdminAction(req.user._id, 'DELETED_STUDENT', 'User', req.params.id);
    res.json({ message: 'Student removed' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete student' });
  }
};

// --------- ROOMS ---------
exports.getRooms = async (req, res) => {
  try {
    const filter = buildFilter(req, ['roomNumber', 'type']);
    const rooms = await Room.find(filter);
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch rooms' });
  }
};

exports.createRoom = async (req, res) => {
  try {
    const room = new Room({ ...req.body, hostelId: req.hostelId });
    await room.save();
    await logAdminAction(req.user._id, 'CREATED_ROOM', 'Room', room._id);
    res.json(room);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create room' });
  }
};

exports.deleteRoom = async (req, res) => {
  try {
    const r = await Room.findOneAndDelete({ _id: req.params.id, hostelId: req.hostelId });
    if(r) await logAdminAction(req.user._id, 'DELETED_ROOM', 'Room', req.params.id);
    res.json({ message: 'Room removed' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete room' });
  }
};

// --------- COMPLAINTS ---------
exports.getComplaints = async (req, res) => {
  try {
    const filter = buildFilter(req, ['title', 'category']);
    const complaints = await Complaint.find(filter).populate('studentId', 'name');
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch complaints' });
  }
};

exports.updateComplaintStatus = async (req, res) => {
  try {
    const { status } = req.body;
    let upDoc = { status };
    if (status === 'Resolved') upDoc.resolvedAt = Date.now();
    const complaint = await Complaint.findOneAndUpdate({ _id: req.params.id, hostelId: req.hostelId }, upDoc, { new: true });
    if(complaint) {
       await logAdminAction(req.user._id, 'RESOLVED_COMPLAINT', 'Complaint', complaint._id);
       await sendNotification(complaint.studentId, 'Complaint Status Updated', `Your complaint "${complaint.title}" is now ${status}.`, 'Info');
    }
    res.json(complaint);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update complaint' });
  }
};

// --------- NOTICES ---------
exports.getNotices = async (req, res) => {
  try {
    const filter = buildFilter(req, ['title', 'content']);
    const notices = await Notice.find(filter).sort({ createdAt: -1 });
    res.json(notices);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch notices' });
  }
};

exports.createNotice = async (req, res) => {
  try {
    const notice = new Notice({ ...req.body, hostelId: req.hostelId, authorId: req.user._id });
    await notice.save();
    await logAdminAction(req.user._id, 'POSTED_NOTICE', 'Notice', notice._id);
    res.json(notice);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create notice' });
  }
};

exports.deleteNotice = async (req, res) => {
  try {
    const n = await Notice.findOneAndDelete({ _id: req.params.id, hostelId: req.hostelId });
    if(n) await logAdminAction(req.user._id, 'DELETED_NOTICE', 'Notice', req.params.id);
    res.json({ message: 'Notice removed' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete notice' });
  }
};
