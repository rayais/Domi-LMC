const { readData, writeData } = require('../../data/helper');

const DATA_FILE = 'lmc/about.json';

const getAbout = (req, res) => {
  try {
    const data = readData(DATA_FILE);
    res.status(200).send(data);
  } catch (error) {
    res.status(400).send({ error: 'Erreur lors de la récupération des données' });
  }
};

const updateAbout = (req, res) => {
  try {
    const { titre, description, mission, vision, valeurs } = req.body;
    const data = readData(DATA_FILE);
    if (titre !== undefined) data.titre = titre;
    if (description !== undefined) data.description = description;
    if (mission !== undefined) data.mission = mission;
    if (vision !== undefined) data.vision = vision;
    if (valeurs !== undefined) data.valeurs = valeurs;
    writeData(DATA_FILE, data);
    res.status(200).send({ msg: 'Contenu à propos mis à jour avec succès' });
  } catch (error) {
    res.status(400).send({ error: 'Erreur lors de la mise à jour' });
  }
};

module.exports = { getAbout, updateAbout };
