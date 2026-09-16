const express = require('express');
const route = express.Router();
const fs = require('fs');
const path = require('path');
const authMiddleware = require('../../middleware/auth');

const SITE_PATH = path.join(__dirname, '../../data/lmc/site.json');
const UPLOAD_DIR = path.join(__dirname, '../../uploads/lmc');

if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const { uploadLmc } = require('../../middleware/upload');
const upload = uploadLmc;

function readSite() {
  try {
    return JSON.parse(fs.readFileSync(SITE_PATH, 'utf8'));
  } catch {
    return {};
  }
}

function writeSite(data) {
  fs.writeFileSync(SITE_PATH, JSON.stringify(data, null, 2), 'utf8');
}

function deleteFile(filePath) {
  try {
    if (filePath && filePath.startsWith('/uploads/')) {
      const fullPath = path.join(__dirname, '..', '..', filePath);
      if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
    }
  } catch {}
}

function deleteUploadedPhotos(temoignages, oldTemoignages) {
  if (!Array.isArray(temoignages) || !Array.isArray(oldTemoignages)) return;
  const oldPhotos = oldTemoignages.map(t => t.photo).filter(Boolean);
  const newPhotos = temoignages.map(t => t.photo).filter(Boolean);
  oldPhotos.forEach(photo => {
    if (!newPhotos.includes(photo)) deleteFile(photo);
  });
}

route.get('/', (req, res) => {
  res.json(readSite());
});

route.put('/', authMiddleware, upload.single('logo'), (req, res) => {
  try {
    const current = readSite();
    const updated = { ...current };

    Object.keys(req.body).forEach(key => {
      if (key !== 'temoignages') updated[key] = req.body[key];
    });

    if (req.file) {
      if (current.logo && current.logo !== '/uploads/lmc/lmc-logo.png') {
        deleteFile(current.logo);
      }
      updated.logo = '/uploads/lmc/' + req.file.filename;
    }

    if (req.body.temoignages) {
      const newTemoignages = typeof req.body.temoignages === 'string'
        ? JSON.parse(req.body.temoignages)
        : req.body.temoignages;
      deleteUploadedPhotos(newTemoignages, current.temoignages || []);
      updated.temoignages = newTemoignages;
    }

    writeSite(updated);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la sauvegarde' });
  }
});

module.exports = route;