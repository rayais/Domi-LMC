const express = require('express');
const route = express.Router();
const multer = require('multer');
const path = require('path');
const { getAll, getBySlug, getById, create, update, remove } = require('../../controllers/lmc/formationController');
const authMiddleware = require('../../middleware/auth');

const storage = multer.diskStorage({
  destination: (req, file, cb) => { cb(null, 'uploads/lmc/') },
  filename: (req, file, cb) => { cb(null, Date.now() + '-' + Math.random().toString(36).substr(2, 5) + path.extname(file.originalname)) },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif|webp|svg|bmp|tiff?|heic|heif|avif/;
    if (filetypes.test(file.mimetype) || filetypes.test(path.extname(file.originalname).toLowerCase()))
      return cb(null, true);
    cb(new Error('Seules les images sont autorisées'));
  },
});

const uploadFields = upload.fields([
  { name: 'logo', maxCount: 1 },
  { name: 'imageVitrine', maxCount: 1 },
  { name: 'galerie', maxCount: 20 }
]);

route.get('/formations', getAll);
route.get('/formation/:slug', getBySlug);
route.get('/formation-id/:id', getById);
route.post('/formation', authMiddleware, uploadFields, create);
route.put('/formation/:id', authMiddleware, uploadFields, update);
route.delete('/formation/:id', authMiddleware, remove);

module.exports = route;
