const express = require('express');
const route = express.Router();
const { getAll, getBySlug, getById, create, update, remove } = require('../../controllers/lmc/formationController');
const authMiddleware = require('../../middleware/auth');
const { uploadLmc } = require('../../middleware/upload');

const uploadFields = uploadLmc.fields([
  { name: 'logo', maxCount: 1 },
  { name: 'imageVitrine', maxCount: 1 },
  { name: 'galerie', maxCount: 20 }
]);

route.get('/formations', getAll);
route.get('/formation/:slug', getBySlug);
route.get('/formation-id/:id', getById);
route.post('/formation', authMiddleware, uploadFields, create);
route.put('/formation/:id', authMiddleware, uploadFields, update);
route.delete('/formation/:id', authMiddleware, remove);

module.exports = route;