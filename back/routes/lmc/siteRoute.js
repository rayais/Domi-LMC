const express = require('express');
const route = express.Router();
const fs = require('fs');
const path = require('path');
const authMiddleware = require('../../middleware/auth');

const SITE_PATH = path.join(__dirname, '../../data/lmc/site.json');

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

route.get('/', (req, res) => {
  res.json(readSite());
});

route.put('/', authMiddleware, (req, res) => {
  try {
    const current = readSite();
    const updated = { ...current, ...req.body };
    writeSite(updated);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la sauvegarde' });
  }
});

module.exports = route;
