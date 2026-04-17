const dotenv = require('dotenv');
dotenv.config();
const multer = require('multer');

// Setup  the cloudinary storage using cloudinary SDK
const storage = multer.memoryStorage();

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

// Initialize multer with Cloudinary storage
const upload = multer({ 
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }
}).single('image_url');

module.exports=upload;

