const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  hostelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hostel' },
  leaveType: { 
    type: String, 
    required: true,
    enum: ['Home Visit', 'Medical', 'Event', 'Other']
  },
  fromDate: { 
    type: Date, 
    required: true 
  },
  toDate: { 
    type: Date, 
    required: true 
  },
  reason: { 
    type: String, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['Pending', 'Approved', 'Rejected'], 
    default: 'Pending' 
  },
  adminComment: { 
    type: String, 
    default: '' 
  },
  requestDate: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Leave', leaveSchema);
