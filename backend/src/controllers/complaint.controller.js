const Complaint = require('../models/Complaint');
const { sendNotification } = require('../utils/logger'); // Optionally notify admin

exports.getComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ studentId: req.user._id }).sort({ createdAt: -1 });
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch complaints' });
  }
};

exports.createComplaint = async (req, res) => {
  try {
    const { title, description, category, priority } = req.body;
    
    // Validate inputs
    if (!title || !description || !category) {
       return res.status(400).json({ error: 'Title, description and category are required' });
    }

    const complaint = new Complaint({
      studentId: req.user._id,
      hostelId: req.hostelId, // Scoped to their hostel
      title,
      description,
      category,
      priority: priority || 'Medium'
    });
    
    await complaint.save();
    res.status(201).json(complaint);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create complaint' });
  }
};
