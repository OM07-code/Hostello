const Leave = require('../models/Leave');

// User: Apply for leave
exports.applyLeave = async (req, res) => {
  const { leaveType, fromDate, toDate, reason } = req.body;
  try {
    const newLeave = new Leave({
      leaveType,
      fromDate,
      toDate,
      reason
    });
    // Calculate total days (just for DB persistence if needed, though frontend handles it mostly)
    await newLeave.save();
    res.json({ message: 'Leave application submitted successfully', leave: newLeave });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// User: Get my leaves
exports.getMyLeaves = async (req, res) => {
  try {
    let leaves = await Leave.find().sort({ requestDate: -1 });

    // Mock data fallback if empty
    if (leaves.length === 0) {
      leaves = await Leave.insertMany([
        { leaveType: 'Home Visit', fromDate: new Date(Date.now() + 86400000*2), toDate: new Date(Date.now() + 86400000*5), reason: 'Family gathering', status: 'Approved' },
        { leaveType: 'Medical', fromDate: new Date(Date.now() - 86400000*10), toDate: new Date(Date.now() - 86400000*8), reason: 'Fever', status: 'Rejected', adminComment: 'Provide medical certificate.' }
      ]);
    }

    res.json(leaves);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Admin: Get all leave requests
exports.getAllLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find().sort({ requestDate: -1 });
    res.json(leaves);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Admin: Approve/Reject leave with comment
exports.updateLeaveStatus = async (req, res) => {
  const { leaveId, status, adminComment } = req.body;
  try {
    const leave = await Leave.findById(leaveId);
    if (!leave) return res.status(404).json({ error: 'Leave not found' });

    leave.status = status;
    if (adminComment) {
      leave.adminComment = adminComment;
    }
    
    await leave.save();
    res.json({ message: 'Leave updated', leave });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
