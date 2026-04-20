const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload.middleware');
const { requireAuth } = require('../middleware/auth.middleware');

router.post('/', requireAuth, upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded or invalid format' });
  }
  
  // If using Cloudinary, req.file.path contains the cloud URL
  // If local, req.file.filename is used
  const fileUrl = req.file.path ? req.file.path : `/uploads/${req.file.filename}`;
  res.json({ message: 'File uploaded successfully', url: fileUrl });
});

module.exports = router;
