const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  hostelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hostel' },
  roomNumber: { 
    type: String, 
    required: true,
    unique: false // A room number could be duplicate across hostels, so uniqueness on roomNumber alone should be dropped
  },
  capacity: { 
    type: Number, 
    required: true, 
    default: 2 
  },
  occupants: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }],
  type: { 
    type: String, 
    enum: ['Single', 'Shared'], 
    required: true 
  },
  floor: { 
    type: Number, 
    required: true 
  },
  gender: { 
    type: String, 
    enum: ['Male', 'Female', 'Unisex'], 
    required: true 
  },
  price: { 
    type: Number, 
    required: true 
  },
  isAvailable: { 
    type: Boolean, 
    default: true 
  }
});

module.exports = mongoose.model('Room', roomSchema);
