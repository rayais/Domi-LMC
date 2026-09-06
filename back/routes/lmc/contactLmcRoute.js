const express = require('express');
const route = express.Router();
const { getAll, create, remove, markAsRead } = require('../../controllers/lmc/contactLmcController');
const authMiddleware = require('../../middleware/auth');

route.get('/contact/messages', authMiddleware, getAll);
route.post('/contact', create);
route.delete('/contact/:id', authMiddleware, remove);
route.put('/contact/:id/read', authMiddleware, markAsRead);

module.exports = route;
