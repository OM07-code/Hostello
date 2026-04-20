const mongoose = require('mongoose');

const hostelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  totalRooms: { type: Number, required: true },
  totalFloors: { type: Number, required: true },
  amenities: [{ type: String }],
  contactNumber: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Hostel', hostelSchema);
