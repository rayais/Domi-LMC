const { readData } = require('../data/helper');

module.exports = function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Non autorisé' });
  }
  const token = authHeader.split(' ')[1];
  const ADMIN_PASSWORD = readData('password.json');
  if (token !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Token invalide' });
  }
  next();
};
