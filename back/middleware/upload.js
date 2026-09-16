const multer = require('multer');
const path = require('path');

const ALLOWED_TYPES = /jpeg|jpg|png|gif|webp|svg|bmp|tiff?|heic|heif|avif/;
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

function createUpload(destination, prefix = 'file') {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, destination),
    filename: (req, file, cb) => {
      cb(null, prefix + '-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5) + path.extname(file.originalname));
    },
  });

  return multer({
    storage,
    limits: { fileSize: MAX_SIZE },
    fileFilter: (req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      if (ALLOWED_TYPES.test(file.mimetype) || ALLOWED_TYPES.test(ext)) {
        return cb(null, true);
      }
      cb(new Error('Seules les images sont autorisées'));
    },
  });
}

const uploadGsd = createUpload('uploads/', 'gsd');
const uploadLmc = createUpload('uploads/lmc/', 'lmc');

module.exports = { uploadGsd, uploadLmc, createUpload };