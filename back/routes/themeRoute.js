const express = require('express');
const route = express.Router();
const { getTheme, updateTheme } = require('../controllers/themeController');
const authMiddleware = require('../middleware/auth');

route.get('/theme', getTheme);
route.put('/theme', authMiddleware, updateTheme);

module.exports = route;
