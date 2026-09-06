const express = require('express');
const route = express.Router();
const { getAbout, updateAbout } = require('../../controllers/lmc/aboutLmcController');
const authMiddleware = require('../../middleware/auth');

route.get('/about', getAbout);
route.put('/about', authMiddleware, updateAbout);

module.exports = route;
