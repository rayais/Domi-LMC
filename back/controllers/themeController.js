const { readData, writeData } = require('../data/helper');

function getTheme(req, res) {
  const theme = readData('theme.json');
  res.json(theme);
}

function updateTheme(req, res) {
  const { colors } = req.body;
  if (!colors || typeof colors !== 'object') {
    return res.status(400).json({ error: 'Format invalide' });
  }
  writeData('theme.json', colors);
  res.json({ success: true, colors });
}

module.exports = { getTheme, updateTheme };
