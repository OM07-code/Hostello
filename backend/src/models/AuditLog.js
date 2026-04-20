const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  action: { type: String, required: true },
  targetModel: { type: String }, // e.g., 'Room', 'Payment'
  targetId: { type: mongoose.Schema.Types.ObjectId },
  details: { type: Object }, // Snapshot or metadata
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AuditLog', auditLogSchema);
