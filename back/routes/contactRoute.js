const express = require('express');
const route = express.Router();
const { getContact, updateContact } = require('../controllers/contactController');
const authMiddleware = require('../middleware/auth');

route.get('/contact', getContact);
route.put('/contact', authMiddleware, updateContact);

module.exports = route;
