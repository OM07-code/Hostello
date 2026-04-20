const express = require('express');
const cors = require('cors');
const path = require('path');
const { requireAuth, requireAdmin } = require('./middleware/auth.middleware');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static upload resources
app.use(express.static(path.join(__dirname, '../public')));

// Basic Routes Placeholder
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Hostello Backend is running.' });
});

app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/upload', require('./routes/upload.routes'));
app.use('/api/dashboard', requireAuth, requireAdmin, require('./routes/dashboard.routes'));
app.use('/api/allocation', require('./routes/allocation.routes'));
app.use('/api/leave', require('./routes/leave.routes'));
app.use('/api/payments', require('./routes/payment.routes'));
app.use('/api/complaints', require('./routes/complaint.routes'));
app.use('/api/admin', requireAuth, requireAdmin, require('./routes/admin.routes'));

module.exports = app;
