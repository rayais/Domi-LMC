const path = require('path');
const fs = require('fs');
const { readData, writeData, getNextId } = require('../data/helper');

const DATA_FILE = 'article.json';
const ID_FIELD = 'id_article';

const getall = async (req, res) => {
  try {
    const data = readData(DATA_FILE);
    res.status(200).send(data);
  } catch (error) {
    res.status(400).send(error);
  }
};

const addArticle = async (req, res) => {
  try {
    const { titre, desc, prix } = req.body;
    const data = readData(DATA_FILE);
    let description = desc;
    if (typeof desc === 'string') {
      try { description = JSON.parse(desc) } catch { description = [desc] }
    }
    if (!Array.isArray(description)) description = [description];
    const newArticle = {
      id_article: getNextId(data, ID_FIELD),
      titre,
      description,
      prix: prix || '',
    };
    if (req.file) {
      newArticle.img = req.file.filename;
    }
    data.push(newArticle);
    writeData(DATA_FILE, data);
    res.status(201).send({ msg: "Article enregistré avec succès" });
  } catch (error) {
    res.status(400).send(error);
  }
};

const supprimer = async (req, res) => {
  try {
    const { id } = req.params;
    const data = readData(DATA_FILE);
    const articleIndex = data.findIndex(a => a.id_article == id);

    if (articleIndex === -1) {
      return res.status(404).send({ error: "Article non trouvé" });
    }

    const article = data[articleIndex];

    if (article.img) {
      const imagePath = path.join(__dirname, "../uploads", article.img);
      fs.unlink(imagePath, (err) => {
        if (err && err.code !== "ENOENT") {
          console.error("Failed to delete image:", err);
        }
      });
    }

    data.splice(articleIndex, 1);
    writeData(DATA_FILE, data);
    res.status(200).send({ msg: "Article supprimé avec succès !" });
  } catch (error) {
    console.error("Error in supprimer:", error);
    res.status(400).send({ error: "An error occurred." });
  }
};

const getArById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = readData(DATA_FILE);
    const article = data.find(a => a.id_article == id);
    if (!article) {
      return res.status(404).send({ error: "Article non trouvé" });
    }
    res.status(200).send(article);
  } catch (error) {
    res.status(400).send(error);
  }
};

const updateArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const { titre, desc, prix } = req.body;
    const data = readData(DATA_FILE);
    const index = data.findIndex(a => a.id_article == id);

    if (index === -1) {
      return res.status(404).send({ error: "Article non trouvé" });
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
      if (data[index].img) {
        const oldImagePath = path.join(__dirname, "../uploads", data[index].img);
        fs.unlink(oldImagePath, (err) => {
          if (err && err.code !== "ENOENT") {
            console.error("Failed to delete old image:", err);
          }
        });
      }
      data[index].img = req.file.filename;
    }

    writeData(DATA_FILE, data);
    res.status(200).send({ msg: "Article modifié avec succès" });
  } catch (error) {
    res.status(400).send(error);
  }
};

module.exports = { addArticle, getall, supprimer, getArById, updateArticle };
