const express = require('express');
const route = express.Router()
const { getall, updateAll } = require('../controllers/statsController');
const authMiddleware = require('../middleware/auth');

route.get('/stats', getall)
route.put('/stats', authMiddleware, updateAll)

module.exports = route
