const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

// Configure Cloudinary
if (process.env.CLOUDINARY_CLOUD_NAME) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

// Ensure destination dir exists for local fallback
const uploadDir = path.join(__dirname, '../../public/uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const diskStorage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function(req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const cloudStorage = process.env.CLOUDINARY_CLOUD_NAME ? new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'hostello_avatars',
    allowed_formats: ['jpg', 'png', 'jpeg'],
  },
}) : null;

const upload = multer({ 
  storage: cloudStorage || diskStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB ceiling
  fileFilter: (req, file, cb) => {
    // Basic format validation
    const allowed = /jpeg|jpg|png|pdf/;
    const extMatch = allowed.test(path.extname(file.originalname).toLowerCase());
    const mimeMatch = allowed.test(file.mimetype);
    if(extMatch && mimeMatch) {
      cb(null, true);
    } else {
      cb(new Error("Only Image or PDF files are allowed"));
    }
  }
});

module.exports = upload;
