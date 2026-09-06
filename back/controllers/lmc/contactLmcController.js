const { readData, writeData } = require('../../data/helper');

const DATA_FILE = 'lmc/contact.json';

const getAll = (req, res) => {
  try {
    const data = readData(DATA_FILE);
    res.status(200).send(data);
  } catch (error) {
    res.status(400).send({ error: 'Erreur lors de la récupération des messages' });
  }
};

const create = (req, res) => {
  try {
    const { nom, email, telephone, sujet, message } = req.body;
    if (!nom || !email || !message) {
      return res.status(400).send({ error: 'Les champs nom, email et message sont requis' });
    }
    const data = readData(DATA_FILE);
    const newMessage = {
      id: Date.now(),
      nom,
      email,
      telephone: telephone || '',
      sujet: sujet || '',
      message,
      date: new Date().toISOString(),
      lu: false
    };
    data.push(newMessage);
    writeData(DATA_FILE, data);
    res.status(201).send({ msg: 'Message envoyé avec succès' });
  } catch (error) {
    res.status(400).send({ error: 'Erreur lors de l\'envoi du message' });
  }
};

const remove = (req, res) => {
  try {
    const { id } = req.params;
    const data = readData(DATA_FILE);
    const index = data.findIndex(m => m.id == id);
    if (index === -1) return res.status(404).send({ error: 'Message non trouvé' });
    data.splice(index, 1);
    writeData(DATA_FILE, data);
    res.status(200).send({ msg: 'Message supprimé avec succès' });
  } catch (error) {
    res.status(400).send({ error: 'Erreur lors de la suppression du message' });
  }
};

const markAsRead = (req, res) => {
  try {
    const { id } = req.params;
    const data = readData(DATA_FILE);
    const message = data.find(m => m.id == id);
    if (!message) return res.status(404).send({ error: 'Message non trouvé' });
    message.lu = true;
    writeData(DATA_FILE, data);
    res.status(200).send({ msg: 'Message marqué comme lu' });
  } catch (error) {
    res.status(400).send({ error: 'Erreur lors de la mise à jour du message' });
  }
};

module.exports = { getAll, create, remove, markAsRead };
