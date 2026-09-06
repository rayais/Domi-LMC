const express = require('express');
const route = express.Router()
const multer = require('multer')
const path= require('path');
const { addArticle, getall, supprimer, getArById, updateArticle } = require('../controllers/articleContro');
const { sendmail } = require('../controllers/mailer');
const { login, loginRateLimiter } = require('../controllers/usercontroller');
const authMiddleware = require('../middleware/auth');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif|webp|svg|bmp|tiff?|heic|heif|avif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Only images are allowed (jpeg, jpg, png, gif, webp, svg, bmp, tiff, heic, avif)"));
  },
});

route.post("/send-email", sendmail);
route.post('/articles', authMiddleware, upload.single("img"), addArticle)
route.get('/articles', getall)
route.delete('/articles/:id', authMiddleware, supprimer)
route.get('/article/:id', getArById)
route.put('/articles/:id', authMiddleware, upload.single("img"), updateArticle)
route.post('/login', loginRateLimiter, login)

module.exports = route
