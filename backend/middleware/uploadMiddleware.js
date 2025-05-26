const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads/images'); // Define your upload directory
    // Create the upload directory if it doesn't exist
    fs.mkdir(uploadPath, { recursive: true }, (err) => {
      if (err) {
        console.error('Error creating upload directory:', err);
        return cb(err, ''); // Pass error to multer
      }
      cb(null, uploadPath);
    });
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

module.exports = { upload };