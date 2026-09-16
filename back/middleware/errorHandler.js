const multer = require('multer');

module.exports = function errorHandler(err, req, res, next) {
  console.error(`[${new Date().toISOString()}]`, err.message);

  if (err instanceof multer.MulterError) {
    const message = err.code === 'LIMIT_FILE_SIZE'
      ? 'Fichier trop volumineux (max 10MB)'
      : 'Erreur lors de l\'envoi du fichier';
    return res.status(400).json({ error: message });
  }

  if (err.message === 'Seules les images sont autorisées') {
    return res.status(400).json({ error: err.message });
  }

  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'JSON invalide' });
  }

  const status = err.status || 500;
  res.status(status).json({
    error: process.env.NODE_ENV === 'production'
      ? 'Erreur interne du serveur'
      : err.message,
  });
};