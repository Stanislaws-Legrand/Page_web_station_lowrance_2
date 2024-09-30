const express = require('express');
const jwt = require('jsonwebtoken');
const CryptoJS = require('crypto-js');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mysql = require('mysql');
const cors = require('cors');

// Clés de sécurité
const SECRET_KEY = 'votre_clé_secrète';
const ENCRYPTION_KEY = 'votre_cle_de_chiffrement';

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());


// Connexion à la base de données MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'Lowrence',
    password: 'AZERTY',
    database: 'Lowrence'
});

db.connect((err) => {
    if (err) {
        console.log('Erreur de connexion à la base de données:', err);
    } else {
        console.log('Connexion réussie à la base de données.');
    }
});

app.post('/login', (req, res) => {
    const { login, passwd } = req.body;

    // Vérifier si l'utilisateur existe
    db.query('SELECT * FROM user WHERE login = ?', [login], async (err, result) => {
        if (err) {
            return res.send('Erreur de base de données.');
        }

        if (result.length === 0) {
            return res.send('<p>Nom d\'utilisateur incorrect.</p>');
        }

        const user = result[0];
        const validPassword = await bcrypt.compare(passwd, user.passwd);

        if (!validPassword) {
            return res.send('<p>Mot de passe incorrect.</p>');
        }

        // Si l'authentification est réussie, générer un token JWT
        const token = jwt.sign(
            { userId: user.id, login: user.login },
            SECRET_KEY,
            { expiresIn: '1h' }  // Le token expire dans 1 heure
        );

        // Chiffrer le token JWT avec AES
        const encryptedToken = CryptoJS.AES.encrypt(token, ENCRYPTION_KEY).toString();

        // Enregistrer le token dans la session ou dans les cookies
        res.cookie('authToken', encryptedToken, { httpOnly: true, secure: true });
        res.redirect('/station');
    });
});

app.post('/register', async (req, res) => {
    const { login, email, passwd } = req.body;

    try {
        // Vérifier si l'utilisateur existe déjà
        const [rows] = await db.query('SELECT * FROM user WHERE login = ?', [login]);
        console.log("Ligne 77 OK")
        if (result.length > 0) {
            return res.send('<p>Nom d\'utilisateur déjà utilisé.</p>');
        }

        // Hacher le mot de passe avant de l'enregistrer
        const hashedPassword = await bcrypt.hash(passwd, 10);

        // Enregistrer le nouvel utilisateur
        await db.query('INSERT INTO user (login, email, passwd) VALUES (?, ?, ?)',
            [login, email, hashedPassword]);
        res.send('<p>Inscription réussie !</p>');
    } catch (err) {
        console.log('Erreur lors de l\'inscription:', err);
        res.send('<p>Inscription échouée, réessayer.</p>');
    }
});


app.use((req, res, next) => {
    const encryptedToken = req.cookies.authToken;

    if (!encryptedToken) {
        return res.redirect('/login');
    }

    try {
        // Décrypter le token
        const bytes = CryptoJS.AES.decrypt(encryptedToken, ENCRYPTION_KEY);
        const decryptedToken = bytes.toString(CryptoJS.enc.Utf8);

        // Vérifier le token JWT
        const decoded = jwt.verify(decryptedToken, SECRET_KEY);

        // Si le token est valide, stocker les informations dans la requête
        req.user = decoded;
        next();
    } catch (err) {
        return res.redirect('/login');
    }
});

// Route pour la page station.html
app.get('/station', (req, res) => {
    res.sendFile(path.join(__dirname, 'station.html'));  // Assurez-vous de donner le bon chemin vers station.html
});


const port = 3000;

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});