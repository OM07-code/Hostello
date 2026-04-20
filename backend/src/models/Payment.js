const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    // We will not strictly require userId right now since auth isn't fully wired, 
    // but in a production app it would be required: true
  },
  hostelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hostel' },
  amount: { 
    type: Number, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['Paid', 'Pending'], 
    default: 'Pending' 
  },
  paymentMethod: { 
    type: String, 
    enum: ['UPI', 'Card', 'Netbanking', null],
    default: null
  },
  transactionId: { 
    type: String 
  },
  dueDate: { 
    type: Date 
  },
  title: {
    type: String,
    default: 'Hostel Fee'
  },
  date: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Payment', paymentSchema);
