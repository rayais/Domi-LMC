const express = require('express');
const route = express.Router();
const { addArticle, getall, supprimer, getArById, updateArticle } = require('../controllers/articleContro');
const authMiddleware = require('../middleware/auth');
const { uploadGsd } = require('../middleware/upload');

route.post('/articles', authMiddleware, uploadGsd.single('img'), addArticle);
route.get('/articles', getall);
route.delete('/articles/:id', authMiddleware, supprimer);
route.get('/article/:id', getArById);
route.put('/articles/:id', authMiddleware, uploadGsd.single('img'), updateArticle);

module.exports = route;