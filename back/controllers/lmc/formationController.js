const { readData, writeData, getNextId } = require('../../data/helper');

const DATA_FILE = 'lmc/formations.json';
const ID_FIELD = 'id';

const sortByOrdre = (arr) => [...arr].sort((a, b) => (a.ordre || 0) - (b.ordre || 0));

const getAll = (req, res) => {
  try {
    const data = readData(DATA_FILE);
    const { type } = req.query;
    if (type === 'intra') return res.status(200).send(sortByOrdre(data.intra || []));
    if (type === 'extra') return res.status(200).send(sortByOrdre(data.extra || []));
    res.status(200).send(data);
  } catch (error) {
    res.status(400).send({ error: 'Erreur lors de la récupération des formations' });
  }
};

const getBySlug = (req, res) => {
  try {
    const { slug } = req.params;
    const data = readData(DATA_FILE);
    const all = [...(data.intra || []), ...(data.extra || [])];
    const formation = all.find(f => f.slug === slug);
    if (!formation) return res.status(404).send({ error: 'Formation non trouvée' });
    res.status(200).send(formation);
  } catch (error) {
    res.status(400).send({ error: 'Erreur lors de la récupération de la formation' });
  }
};

const getById = (req, res) => {
  try {
    const { id } = req.params;
    const data = readData(DATA_FILE);
    const all = [...(data.intra || []), ...(data.extra || [])];
    const formation = all.find(f => f.id === id);
    if (!formation) return res.status(404).send({ error: 'Formation non trouvée' });
    res.status(200).send(formation);
  } catch (error) {
    res.status(400).send({ error: 'Erreur lors de la récupération de la formation' });
  }
};

const create = (req, res) => {
  try {
    const { type, nom, slug, description, descriptionLongue, duree, publicCible, objectifs, ordre, afficherAccueil } = req.body;
    if (!type || !nom || !slug) {
      return res.status(400).send({ error: 'Les champs type, nom et slug sont requis' });
    }
    if (type !== 'intra' && type !== 'extra') {
      return res.status(400).send({ error: 'Le type doit être "intra" ou "extra"' });
    }
    const data = readData(DATA_FILE);
    if (!data[type]) data[type] = [];
    let logo = '';
    let imageVitrine = '';
    let galerie = [];
    if (req.files) {
      if (req.files.logo && req.files.logo[0]) logo = '/uploads/lmc/' + req.files.logo[0].filename;
      if (req.files.imageVitrine && req.files.imageVitrine[0]) imageVitrine = '/uploads/lmc/' + req.files.imageVitrine[0].filename;
      if (req.files.galerie) galerie = req.files.galerie.map(f => '/uploads/lmc/' + f.filename);
    }
    const parsedObjectifs = objectifs ? (typeof objectifs === 'string' ? JSON.parse(objectifs) : objectifs) : [];
    const newFormation = {
      id: 'lmc-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
      nom,
      slug,
      logo,
      imageVitrine,
      galerie,
      description: description || '',
      descriptionLongue: descriptionLongue || '',
      duree: duree || '',
      publicCible: publicCible || '',
      objectifs: parsedObjectifs,
      afficherAccueil: afficherAccueil === 'true' || afficherAccueil === true,
      ordre: parseInt(ordre) || data[type].length + 1
    };
    data[type].push(newFormation);
    writeData(DATA_FILE, data);
    res.status(201).send({ msg: 'Formation créée avec succès', formation: newFormation });
  } catch (error) {
    res.status(400).send({ error: 'Erreur lors de la création de la formation' });
  }
};

const update = (req, res) => {
  try {
    const { id } = req.params;
    const data = readData(DATA_FILE);
    let found = false;
    for (const type of ['intra', 'extra']) {
      if (!data[type]) continue;
      const index = data[type].findIndex(f => f.id === id);
      if (index === -1) continue;
      found = true;
      const { nom, slug, description, descriptionLongue, duree, publicCible, objectifs, ordre, afficherAccueil, type: newType } = req.body;
      if (nom !== undefined) data[type][index].nom = nom;
      if (slug !== undefined) data[type][index].slug = slug;
      if (description !== undefined) data[type][index].description = description;
      if (descriptionLongue !== undefined) data[type][index].descriptionLongue = descriptionLongue;
      if (duree !== undefined) data[type][index].duree = duree;
      if (publicCible !== undefined) data[type][index].publicCible = publicCible;
      if (objectifs !== undefined) {
        data[type][index].objectifs = typeof objectifs === 'string' ? JSON.parse(objectifs) : objectifs;
      }
      if (ordre !== undefined) data[type][index].ordre = parseInt(ordre);
      if (afficherAccueil !== undefined) data[type][index].afficherAccueil = afficherAccueil === 'true' || afficherAccueil === true;
      if (req.files) {
        if (req.files.logo && req.files.logo[0]) data[type][index].logo = '/uploads/lmc/' + req.files.logo[0].filename;
        if (req.files.imageVitrine && req.files.imageVitrine[0]) data[type][index].imageVitrine = '/uploads/lmc/' + req.files.imageVitrine[0].filename;
        if (req.files.galerie) data[type][index].galerie = req.files.galerie.map(f => '/uploads/lmc/' + f.filename);
      }
      if (newType && newType !== type && (newType === 'intra' || newType === 'extra')) {
        const formation = data[type].splice(index, 1)[0];
        if (!data[newType]) data[newType] = [];
        data[newType].push(formation);
      }
      break;
    }
    if (!found) return res.status(404).send({ error: 'Formation non trouvée' });
    writeData(DATA_FILE, data);
    res.status(200).send({ msg: 'Formation modifiée avec succès' });
  } catch (error) {
    res.status(400).send({ error: 'Erreur lors de la modification de la formation' });
  }
};

const remove = (req, res) => {
  try {
    const { id } = req.params;
    const data = readData(DATA_FILE);
    let found = false;
    for (const type of ['intra', 'extra']) {
      if (!data[type]) continue;
      const index = data[type].findIndex(f => f.id === id);
      if (index === -1) continue;
      data[type].splice(index, 1);
      found = true;
      break;
    }
    if (!found) return res.status(404).send({ error: 'Formation non trouvée' });
    writeData(DATA_FILE, data);
    res.status(200).send({ msg: 'Formation supprimée avec succès' });
  } catch (error) {
    res.status(400).send({ error: 'Erreur lors de la suppression de la formation' });
  }
};

module.exports = { getAll, getBySlug, getById, create, update, remove };
