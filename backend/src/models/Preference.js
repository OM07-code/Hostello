const mongoose = require('mongoose');

const preferenceSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  // We'll mock a generic name here for Gemini prompt readability since 'User' isn't fully mocked
  studentName: {
    type: String,
    required: true
  },
  budget: { 
    type: Number, 
    required: true 
  },
  roomType: { 
    type: String, 
    enum: ['Single', 'Shared'], 
    required: true 
  },
  floorPreference: { 
    type: String, 
    enum: ['Lower', 'Higher', 'Any'], 
    default: 'Any' 
  },
  gender: { 
    type: String, 
    enum: ['Male', 'Female'],
    required: true
  },
  // Personality Questionnaire Array
  personalityAnswers: {
     sleepSchedule: { type: String, default: 'Night Owl' }, 
     cleanliness: { type: String, default: 'Relaxed' },   
     social: { type: String, default: 'Introvert' },        
  },
  isAllocated: { 
    type: Boolean, 
    default: false 
  },
  allocatedRoomId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Room', 
    default: null 
  }
});

module.exports = mongoose.model('Preference', preferenceSchema);
