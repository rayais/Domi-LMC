const { readData, writeData, getNextId } = require('../data/helper');
const fs = require('fs');
const path = require('path');

const DATA_FILE = 'extras.json';
const ID_FIELD = 'id_extra';

function deleteFile(filename) {
  try {
    if (filename && !filename.startsWith('/') && !filename.match(/^[\u{1F300}-\u{1F9FF}]/u)) {
      const fullPath = path.join(__dirname, '../uploads', filename);
      if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
    }
  } catch {}
}

const getall = async (req, res) => {
  try {
    const data = readData(DATA_FILE);
    res.status(200).send(data);
  } catch (error) {
    res.status(400).send(error);
  }
};

const addExtra = async (req, res) => {
  try {
    const { titre, desc, prix } = req.body;
    const data = readData(DATA_FILE);
    let description = desc;
    if (typeof desc === 'string') {
      try { description = JSON.parse(desc) } catch { description = [desc] }
    }
    if (!Array.isArray(description)) description = [description];
    let icone = req.body.icone || '';
    if (req.file) icone = req.file.filename;
    const newExtra = {
      id_extra: getNextId(data, ID_FIELD),
      titre,
      description,
      prix: prix || '',
      icone,
    };
    data.push(newExtra);
    writeData(DATA_FILE, data);
    res.status(201).send({ msg: "Extra enregistré avec succès" });
  } catch (error) {
    res.status(400).send(error);
  }
};

const supprimer = async (req, res) => {
  try {
    const { id } = req.params;
    const data = readData(DATA_FILE);
    const index = data.findIndex(e => e.id_extra == id);
    if (index === -1) {
      return res.status(404).send({ error: "Extra non trouvé" });
    }
    if (data[index].icone) deleteFile(data[index].icone);
    data.splice(index, 1);
    writeData(DATA_FILE, data);
    res.status(200).send({ msg: "Extra supprimé avec succès" });
  } catch (error) {
    res.status(400).send(error);
  }
};

const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = readData(DATA_FILE);
    const extra = data.find(e => e.id_extra == id);
    if (!extra) {
      return res.status(404).send({ error: "Extra non trouvé" });
    }
    res.status(200).send(extra);
  } catch (error) {
    res.status(400).send(error);
  }
};

const updateExtra = async (req, res) => {
  try {
    const { id } = req.params;
    const { titre, desc, prix, icone } = req.body;
    const data = readData(DATA_FILE);
    const index = data.findIndex(e => e.id_extra == id);
    if (index === -1) {
      return res.status(404).send({ error: "Extra non trouvé" });
    }
    if (titre !== undefined) data[index].titre = titre;
    if (desc !== undefined) {
      let description = desc;
      if (typeof desc === 'string') {
        try { description = JSON.parse(desc) } catch { description = [desc] }
      }
      if (!Array.isArray(description)) description = [description];
      data[index].description = description;
    }
    if (prix !== undefined) data[index].prix = prix;
    if (req.file) {
      if (data[index].icone) deleteFile(data[index].icone);
      data[index].icone = req.file.filename;
    } else if (icone !== undefined) data[index].icone = icone;
    writeData(DATA_FILE, data);
    res.status(200).send({ msg: "Extra modifié avec succès" });
  } catch (error) {
    res.status(400).send(error);
  }
};

module.exports = { addExtra, getall, supprimer, getById, updateExtra };
