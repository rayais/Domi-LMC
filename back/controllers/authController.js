const { readData, writeData } = require('../data/helper');

const PWD_FILE = 'password.json';

const login = async (req, res) => {
  try {
    const { password } = req.body;
    const ADMIN_PASSWORD = readData(PWD_FILE);
    if (password === ADMIN_PASSWORD) {
      res.status(200).send({ token: password, expiresIn: 86400 });
    } else {
      res.status(401).send({ error: 'Mot de passe incorrect' });
    }
  } catch (error) {
    res.status(400).send(error);
  }
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const ADMIN_PASSWORD = readData(PWD_FILE);
    if (currentPassword !== ADMIN_PASSWORD) {
      return res.status(401).send({ error: 'Mot de passe actuel incorrect' });
    }
    if (!newPassword || newPassword.length < 4) {
      return res.status(400).send({ error: 'Le nouveau mot de passe doit faire au moins 4 caractères' });
    }
    writeData(PWD_FILE, newPassword);
    res.status(200).send({ msg: 'Mot de passe modifié avec succès' });
  } catch (error) {
    res.status(400).send(error);
  }
};

module.exports = { login, changePassword };