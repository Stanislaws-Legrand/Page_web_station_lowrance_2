// Importation des modules nécessaires
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const cors = require('cors');

// Initialisation de l'application Express
const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());  // Permet les requêtes CORS si nécessaire

// Connexion à la base de données SQLite
const db = new sqlite3.Database('./users.db', (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('Connecté à la base de données SQLite.');
    }
});

// Création de la table des utilisateurs si elle n'existe pas
db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    login TEXT UNIQUE,
    password TEXT,
    email TEXT UNIQUE
)`);

// Route d'inscription
app.post('/register', (req, res) => {
    const { login, password, email } = req.body;

    // Hachage du mot de passe
    bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
            return res.status(500).json({ error: 'Erreur lors du hachage du mot de passe.' });
        }

        // Insertion dans la base de données
        db.run(`INSERT INTO users (login, password, email) VALUES (?, ?, ?)`, [login, hash, email], function(err) {
            if (err) {
                return res.status(400).json({ error: 'Nom d\'utilisateur ou email déjà utilisés.' });
            }
            res.status(201).json({ message: 'Utilisateur créé avec succès!', userId: this.lastID });
        });
    });
});

// Route de connexion
app.post('/login', (req, res) => {
    const { login, password } = req.body;

    // Recherche de l'utilisateur dans la base de données
    db.get(`SELECT * FROM users WHERE login = ?`, [login], (err, user) => {
        if (err || !user) {
            return res.status(401).json({ error: 'Nom d\'utilisateur ou mot de passe incorrect.' });
        }

        // Vérification du mot de passe
        bcrypt.compare(password, user.password, (err, result) => {
            if (err || !result) {
                return res.status(401).json({ error: 'Nom d\'utilisateur ou mot de passe incorrect.' });
            }
            res.status(200).json({ message: 'Connexion réussie!' });
        });
    });
});

// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`Serveur en cours d'exécution sur http://localhost:${PORT}`);
});

// Gestion de la fermeture de la base de données
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Connexion à la base de données fermée.');
        process.exit(0);
    });
});
