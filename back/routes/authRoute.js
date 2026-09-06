const express = require('express');
const route = express.Router()
const rateLimit = require('express-rate-limit');
const { login, changePassword } = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: "Trop de tentatives. Réessayez dans 15 minutes." },
})

route.post('/login', loginLimiter, login)
route.put('/change-password', authMiddleware, changePassword)

module.exports = route