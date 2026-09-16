const express = require('express');
const route = express.Router();
const { login, changePassword, loginLimiter } = require('../controllers/usercontroller');
const authMiddleware = require('../middleware/auth');

route.post('/login', loginLimiter, login);
route.put('/change-password', authMiddleware, changePassword);

module.exports = route;