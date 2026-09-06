const { readData, writeData } = require('../data/helper');

const FILE = 'contact.json';

const getContact = (req, res) => {
  try {
    const data = readData(FILE);
    res.status(200).send(data);
  } catch (error) {
    res.status(400).send(error);
  }
};

const updateContact = (req, res) => {
  try {
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
    writeData(FILE, { phone, email, address, facebook: facebook || '', tiktok: tiktok || '', instagram: instagram || '', latitude: lat, longitude: lng });
    res.status(200).json({ msg: 'Contact mis à jour avec succès' });
  } catch (error) {
    res.status(400).send(error);
  }
};

module.exports = { getContact, updateContact };
