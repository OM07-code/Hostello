const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['Admin', 'Student'], default: 'Student' },
  hostelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hostel' },
  
  // Student Specific
  mobileNumber: { type: String },
  bloodGroup: { type: String },
  residentialAddress: { type: String },
  parentDetails: {
    fatherName: String,
    motherName: String,
    parentContact: String
  },
  emergencyContact: { type: String },
  
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  idProofUrl: { type: String }, // For file uploads
  createdAt: { type: Date, default: Date.now }
});

userSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (err) {
    throw err;
  }
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
