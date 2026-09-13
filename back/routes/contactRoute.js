const express = require('express');
const route = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const authMiddleware = require('../middleware/auth');

const CONTACT_PATH = path.join(__dirname, '../data/contact.json');
const UPLOAD_DIR = path.join(__dirname, '../uploads');

if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => cb(null, 'gsd-logo-' + Date.now() + path.extname(file.originalname)),
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp|avif|svg/;
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.test(file.mimetype) || allowed.test(ext)) return cb(null, true);
    cb(new Error('Seules les images sont autorisées'));
  },
});

function readContact() {
  try {
    return JSON.parse(fs.readFileSync(CONTACT_PATH, 'utf8'));
  } catch {
    return {};
  }
}

function writeContact(data) {
  fs.writeFileSync(CONTACT_PATH, JSON.stringify(data, null, 2), 'utf8');
}

function deleteFile(filePath) {
  try {
    if (filePath && filePath.startsWith('/uploads/')) {
      const fullPath = path.join(__dirname, '..', filePath);
      if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
    }
  } catch {}
}

route.get('/contact', (req, res) => {
  try {
    res.status(200).send(readContact());
  } catch (error) {
    res.status(400).send(error);
  }
});

route.put('/contact', authMiddleware, upload.single('logo'), (req, res) => {
  try {
    const current = readContact();
    const { phone, email, address, facebook, tiktok, instagram, latitude, longitude } = req.body;

    if (!phone || !email || !address) {
      return res.status(400).json({ error: 'Tous les champs sont requis' });
    }

    const lat = latitude === '' || latitude == null ? null : Number(latitude);
    const lng = longitude === '' || longitude == null ? null : Number(longitude);
    if (lat !== null && (isNaN(lat) || lat < -90 || lat > 90)) {
      return res.status(400).json({ error: 'Latitude invalide (entre -90 et 90)' });
    }
    if (lng !== null && (isNaN(lng) || lng < -180 || lng > 180)) {
      return res.status(400).json({ error: 'Longitude invalide (entre -180 et 180)' });
    }

    let logo = current.logo || '/uploads/logonav.png';
    if (req.file) {
      if (current.logo && current.logo !== '/uploads/logonav.png') {
        deleteFile(current.logo);
      }
      logo = '/uploads/' + req.file.filename;
    }

    writeContact({ phone, email, address, logo, facebook: facebook || '', tiktok: tiktok || '', instagram: instagram || '', latitude: lat, longitude: lng });
    res.status(200).json({ msg: 'Contact mis à jour avec succès' });
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = route;
