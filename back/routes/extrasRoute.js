const express = require('express');
const route = express.Router()
const multer = require('multer')
const path = require('path')
const { addExtra, getall, supprimer, getById, updateExtra } = require('../controllers/extrasController');
const authMiddleware = require('../middleware/auth');

const storage = multer.diskStorage({
  destination: (req, file, cb) => { cb(null, "uploads/") },
  filename: (req, file, cb) => { cb(null, Date.now() + path.extname(file.originalname)) },
})

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif|webp|svg|bmp|tiff?|heic|heif|avif/
    if (filetypes.test(file.mimetype) || filetypes.test(path.extname(file.originalname).toLowerCase()))
      return cb(null, true)
    cb(new Error("Only images are allowed"))
  },
})

route.get('/extras', getall)
route.post('/extras', authMiddleware, upload.single("icone"), addExtra)
route.put('/extras/:id', authMiddleware, upload.single("icone"), updateExtra)
route.delete('/extras/:id', authMiddleware, supprimer)
route.get('/extra/:id', getById)

module.exports = route
