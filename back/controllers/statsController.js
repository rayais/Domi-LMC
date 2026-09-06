const { readData, writeData } = require('../data/helper');

const DATA_FILE = 'stats.json';

const getall = async (req, res) => {
  try {
    const data = readData(DATA_FILE);
    res.status(200).send(data);
  } catch (error) {
    res.status(400).send(error);
  }
};

const updateAll = async (req, res) => {
  try {
    const { stats } = req.body;
    if (!Array.isArray(stats)) {
      return res.status(400).send({ error: "stats doit être un tableau" });
    }
    writeData(DATA_FILE, stats);
    res.status(200).send({ msg: "Statistiques mises à jour avec succès" });
  } catch (error) {
    res.status(400).send(error);
  }
};

module.exports = { getall, updateAll };
