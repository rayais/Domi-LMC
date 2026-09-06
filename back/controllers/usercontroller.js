const dotenv = require("dotenv");
const { readData, writeData } = require("../data/helper");
dotenv.config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const rateLimit = require("express-rate-limit");

const DATA_FILE = "passuser.json";

const limiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 5,
  message: "Trop de tentatives de connexion. Veuillez réessayer plus tard.",
  handler: (req, res) => {
    res.status(429).json({
      error:
        "Trop de tentatives de connexion. Veuillez réessayer dans 5 mins.",
    });
  },
});

const login = async (req, res) => {
  try {
    const { password } = req.body;
    if (!password || typeof password !== "string") {
      return res.status(400).json({
        error:
          "Le mot de passe est requis et doit être une chaîne de caractères.",
      });
    }

    let users = readData(DATA_FILE);
    if (!users || users.length === 0) {
      const hashedPassword = await bcrypt.hash(process.env.MAIN_PASS, 10);
      users = [{ id: 1, login: "Admin", password: hashedPassword }];
      writeData(DATA_FILE, users);
      return res.status(201).json({
        message: "Mot de passe initial créé avec succès.",
      });
    }

    const isMatch = await bcrypt.compare(password, users[0].password);
    if (!isMatch) {
      return res.status(401).json({
        error: "Mot de passe incorrect.",
      });
    }

    const token = jwt.sign(
      { userId: users[0].id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Connexion réussie.",
      token,
      expiresIn: 3600,
    });
  } catch (error) {
    console.error("Erreur de connexion:", error);
    res.status(500).json({
      error: "Une erreur est survenue lors de la tentative de connexion.",
    });
  }
};

module.exports = {
  login,
  loginRateLimiter: limiter,
};
