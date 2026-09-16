# CHANGELOG — Domi-LMC Refactoring

> **Fichier de communication entre agents IA.**
> Chaque entrée documente un changement effectué : quoi, pourquoi, où, et impact.
> Les agents lisent ce fichier en premier pour comprendre l'état du projet.

---

## 2026-09-16 — Refactoring Sécurité & Architecture

### C1: Auth unifiée → bcrypt + JWT
- **Pourquoi** : Le système avait 2 auth en conflit. L'ancienne comparait le password en clair.
- **Fichiers supprimés** : `back/controllers/authController.js`, `back/routes/authRoute.js`
- **Fichiers modifiés** : `back/middleware/auth.js` (vérifie JWT au lieu de comparer le password), `back/controllers/usercontroller.js` (ajout de `changePassword` avec bcrypt)
- **Fichiers créés** : `back/routes/authRoute.js` (nouveau, route unique pour login + changePassword)
- **Impact frontend** : Aucun, les endpoints `/login` et `/change-password` restent identiques. Le format de réponse est le même (`{ token, expiresIn }`).

### C2: Password Admin → .env
- **Pourquoi** : Le mot de passe admin ("admin") était en clair dans `password.json` versionné sur GitHub.
- **Fichiers créés** : `.env` (JWT_SECRET auto-généré + MAIN_PASS), `.env.example`
- **Fichiers supprimés** : `back/data/password.json`
- **Impact** : Le premier lancement crée automatiquement le hash bcrypt dans `passuser.json` depuis `MAIN_PASS`.

### C3: Mailer supprimé → Messages dans dashboard
- **Pourquoi** : Le mailer exposait un secret Gmail et les deux sites doivent gérer les messages via le dashboard admin.
- **Fichiers supprimés** : `back/controllers/mailer.js`
- **Fichiers modifiés** : `back/routes/articleRoute.js` (route `/send-email` supprimée), `front/src/components/Contact.jsx` (envoie un message JSON au lieu d'un email)
- **Fichiers créés** : `back/routes/contactMessageRoute.js` (CRUD messages GSD), `back/data/messages.json` (stockage messages GSD)
- **Frontend modifié** : `front/src/pages/Admin.jsx` (nouvel onglet "Messages"), `front/src/services/api.js` (fonctions messages GSD)
- **Impact** : Le formulaire de contact GSD enregistre les messages dans le dashboard admin au lieu d'envoyer un email.

### C4: Gestion d'erreurs globale
- **Pourquoi** : Pas de middleware error handler centralisé. Les erreurs étaient gérées de manière inconsistante.
- **Fichiers créés** : `back/middleware/errorHandler.js`
- **Fichiers modifiés** : `back/server.js` (ajout du handler en dernier middleware)
- **Impact** : Toutes les erreurs non gérées passent par le handler. Pas de fuite d'info en production.

### C5: Multer centralisé
- **Pourquoi** : La config Multer était copiée-collée dans 7 fichiers avec des regex différentes.
- **Fichiers créés** : `back/middleware/upload.js` (config unique)
- **Fichiers modifiés** : Toutes les routes qui utilisent Multer (`articleRoute.js`, `extrasRoute.js`, `heroSlidesRoute.js`, `contactRoute.js`, `lmc/formationRoute.js`, `lmc/siteRoute.js`, `lmc/heroSlidesRoute.js`)
- **Impact** : Config fichier unique, même regex, même limite 10MB.

### C6: Conflits de routes résolus
- **Pourquoi** : `POST /login` monté 2 fois (authRoute + articleRoute), `POST /send-email` exposait le mailer.
- **Fichiers modifiés** : `back/routes/articleRoute.js` (login + sendmail supprimés), `back/server.js` (montage propre des routes)
- **Résultat** : Chaque endpoint a un seul monteur. Pas de doublon.

### C7: Bug corrigé — Admin LMC (siteLogo hors de portée)
- **Pourquoi** : Le composant `LoginForm` dans `front-lmc/src/pages/Admin.jsx` référençait la variable `siteLogo` qui n'existe que dans l'état du parent `Admin()`. → `ReferenceError` au rendu de la page de login.
- **Fichiers modifiés** : `front-lmc/src/pages/Admin.jsx` (logo de login remplacé par `lmcLogoFallback` statique)

### C8: Références obsolètes nettoyées
- **Pourquoi** : `send-email` et l'ancien multer étaient encore référencés dans la config de déploiement.
- **Fichiers modifiés** : `deploy.sh` (regex nginx : `send-email` retiré, `messages|message` ajouté), `front/vite.config.js` (proxy `send-email` → `messages|message`)

---

## État des fichiers après refactoring

```
back/
  config.js              ← inchangé
  server.js              ← MODIFIÉ (routes restructurées, error handler)
  package.json           ← MODIFIÉ (nodemailer retiré, dotenv ajouté)
  controllers/
    articleContro.js     ← MODIFIÉ (multer importé depuis upload.js)
    extrasController.js  ← inchangé
    contactController.js ← inchangé
    usercontroller.js    ← MODIFIÉ (changePassword ajouté)
    mailer.js            ← SUPPRIMÉ
    authController.js    ← SUPPRIMÉ
    statsController.js   ← inchangé
    themeController.js   ← inchangé
    lmc/
      formationController.js   ← inchangé
      contactLmcController.js  ← inchangé
      aboutLmcController.js    ← inchangé
  middleware/
    auth.js              ← MODIFIÉ (JWT verification)
    upload.js            ← CRÉÉ (multer centralisé)
    errorHandler.js      ← CRÉÉ (gestion erreurs globale)
  routes/
    authRoute.js         ← RECRÉ (login bcrypt+JWT + changePassword)
    articleRoute.js      ← MODIFIÉ (login/sendmail supprimés, multer centralisé)
    extrasRoute.js       ← MODIFIÉ (multer centralisé)
    heroSlidesRoute.js   ← MODIFIÉ (multer centralisé)
    contactRoute.js      ← MODIFIÉ (multer centralisé)
    contactMessageRoute.js ← CRÉÉ (messages GSD)
    aboutRoute.js        ← inchangé
    statsRoute.js        ← inchangé
    themeRoute.js        ← inchangé
    lmc/
      formationRoute.js   ← MODIFIÉ (multer centralisé)
      siteRoute.js        ← MODIFIÉ (multer centralisé)
      heroSlidesRoute.js  ← MODIFIÉ (multer centralisé)
      aboutLmcRoute.js    ← inchangé
      contactLmcRoute.js  ← inchangé
  data/
    password.json        ← SUPPRIMÉ
    messages.json        ← CRÉÉ (messages GSD)
    passuser.json        ← inchangé (hash bcrypt existant)

front/src/
  pages/Admin.jsx        ← MODIFIÉ (onglet Messages ajouté)
  services/api.js        ← MODIFIÉ (fonctions messages GSD, sendmail supprimé)
  components/Contact.jsx ← MODIFIÉ (envoie message au lieu d'email)

front-lmc/
  src/pages/Admin.jsx    ← MODIFIÉ (C7: bug siteLogo corrigé)

déploiement/
  deploy.sh              ← MODIFIÉ (C8: regex nginx)
  front/vite.config.js   ← MODIFIÉ (C8: proxy)
```
