const express = require('express');
const route = express.Router();
const { addExtra, getall, supprimer, getById, updateExtra } = require('../controllers/extrasController');
const authMiddleware = require('../middleware/auth');
const { uploadGsd } = require('../middleware/upload');

route.get('/extras', getall);
route.post('/extras', authMiddleware, uploadGsd.single('icone'), addExtra);
route.put('/extras/:id', authMiddleware, uploadGsd.single('icone'), updateExtra);
route.delete('/extras/:id', authMiddleware, supprimer);
route.get('/extra/:id', getById);

module.exports = route;