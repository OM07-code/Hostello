const Notification = require('../models/Notification');
const AuditLog = require('../models/AuditLog');

exports.sendNotification = async (userId, title, message, type = 'Info') => {
  try {
    const notif = new Notification({ userId, title, message, type });
    await notif.save();
    console.log(`[Notification] To ${userId}: ${title}`);
  } catch (err) {
    console.error('Failed to create notification', err);
  }
};

exports.logAdminAction = async (adminId, action, targetModel = null, targetId = null, details = {}) => {
  if (!adminId) return; // Skip if no context
  try {
    const log = new AuditLog({ adminId, action, targetModel, targetId, details });
    await log.save();
    console.log(`[Audit] Admin ${adminId} -> ${action}`);
  } catch (err) {
    console.error('Failed to create audit log', err);
  }
};
