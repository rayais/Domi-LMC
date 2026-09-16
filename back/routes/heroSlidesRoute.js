const express = require('express');
const route = express.Router();
const path = require('path');
const fs = require('fs');
const { readData, writeData } = require('../data/helper');
const authMiddleware = require('../middleware/auth');

const UPLOAD_DIR = path.join(__dirname, '../uploads');

if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const { uploadGsd } = require('../middleware/upload');
const upload = uploadGsd;

function getData() {
  const data = readData('heroSlides.json');
  if (!data || !Array.isArray(data.slides)) return { slides: [], interval: 5000 };
  return data;
}

function saveData(data) {
  writeData('heroSlides.json', data);
}

route.get('/hero-slides', (req, res) => {
  res.json(getData());
});

route.put('/hero-slides', authMiddleware, (req, res) => {
  const { slides, interval } = req.body;
  const data = getData();
  if (Array.isArray(slides)) data.slides = slides;
  if (typeof interval === 'number' && interval >= 1000) data.interval = interval;
  saveData(data);
  res.json(data);
});

route.post('/hero-slides/upload', authMiddleware, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Aucun fichier envoyé' });
  res.json({ image: '/uploads/' + req.file.filename });
});

route.delete('/hero-slides/:id', authMiddleware, (req, res) => {
  const data = getData();
  const id = Number(req.params.id);
  const slide = data.slides.find(s => s.id === id);
  if (!slide) return res.status(404).json({ error: 'Slide introuvable' });

  if (slide.image && slide.image.startsWith('/uploads/')) {
    const filePath = path.join(__dirname, '..', slide.image);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  }

  data.slides = data.slides.filter(s => s.id !== id);
  saveData(data);
  res.json({ success: true });
});

module.exports = route;