const { readData, writeData } = require('../data/helper');

const FILE = 'about.json';

const getAbout = (req, res) => {
  try {
    const data = readData(FILE);
    res.status(200).send(data);
  } catch (error) {
    res.status(400).send(error);
  }
};

const updateAbout = (req, res) => {
  try {
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }
    writeData(FILE, { content });
    res.status(200).json({ msg: 'About content updated' });
  } catch (error) {
    res.status(400).send(error);
  }
};

module.exports = { getAbout, updateAbout };
