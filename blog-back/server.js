const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const webpush = require('web-push');
const multer = require('multer');

// Cette paire de clé VAPID a été générée à partir de la commande
// web-push generate-vapid-keys (nécessite l'installation de web-push)
const publicPushKey = 'BDBygkzwIYk2dPeN2Kl5R9BfrPrm3kHWIRzCnfAcxOVU1rYY4BdaBmUJtEaeeCfic9wgqRA3nbHmP9buypKcAd8';
const privatePushKey = 'p21WOsSx--Hi8HkUYbrZed1euo7Huqf0wXH59hCPENk';

// Pré-configuration de webpush
webpush.setVapidDetails(
    // On doit nécessairement indiquer un email
    'mailto:gabriel.ley@outlook.fr',
    // Public key
    publicPushKey,
    // Private key
    privatePushKey,
);

// Configuration du stockage de mes fichiers uploadés
const diskStorage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
        cb(null, Date.now() + '.jpeg');
    }
});
const uploader = multer({storage: diskStorage});

const app = express();

// Middlewares express
// Conversion automatique du json
app.use(express.json());
// Acceptation du cors dans les headers
app.use(cors());
// Rend le dossier /uploads accessible au public
app.use('/uploads', express.static('uploads'));

// Port sur lequelle mon serveur tourne
const port = 8000;

// Initialisation de ma database, est lancé à chaque fois que je lance
// mon serveur pour être sûr que tout est en ordre
function initDatabase(){
    const db = new sqlite3.Database('./database.db');
    const createPostsTableQuery = `CREATE TABLE IF NOT EXISTS posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title VARCHAR(255) NOT NULL,
        body TEXT NOT NULL,
        date VARCHAR(100) NOT NULL,
        photo VARCHAR(255) NOT NULL
    );`;

    db.run(createPostsTableQuery, err => {
        if(err){
            console.log("Erreur lors de la création de la table");
        }

        console.log("Initialisation table posts ok !");
    });

    const createSubscriptionsTableQuery = `CREATE TABLE IF NOT EXISTS subscriptions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        endpoint VARCHAR(500) NOT NULL,
        key_auth VARCHAR(255) NOT NULL,
        key_p256dh VARCHAR(255) NOT NULL
    );`;

    db.run(createSubscriptionsTableQuery, err => {
        if(err){
            console.log("Erreur lors de la création de la table");
        }

        console.log("Initialisation table subscriptions ok !");
    });

    return db;
}

const db = initDatabase();


// Requête pour récupérer les posts. RAS
app.get('/', (req, res) => {
    db.all('SELECT * FROM posts ORDER BY id DESC;', [], (err, rows) => {
        if(err){
            console.log("DB ERROR : ", err);
        }

        rows = rows.map(x => {
            x.date = new Date(x.date).toLocaleString('fr')
            return x;
        })

        res.json({'results': rows});
    })
});

// Création d'un abonnement en BDD.
// Le format standard est {
//   endpoint: '...',
//   keys: {
//     pd256h: '...',
//     auth: '...' 
//   }
// } 
// Je dois donc remettre ça à plat pour pouvoir l'enregistrer dans ma base
// (ne concerne pas les bases noSQL type MongoDB)
app.post('/subscribe', (req, res) => {
    console.log("subscribing", req.body);
    db.run(
        "INSERT INTO subscriptions(endpoint, key_auth, key_p256dh) VALUES (?, ?, ?);",
        [req.body.endpoint, req.body.keys.auth, req.body.keys.p256dh],
        (error) => {
            if(error){
                console.log("DB ERROR : ", error);
                res.status(500);
                res.json({'status': 'nok'});
            } else {
                res.status(201);
                res.json({'status': 'created'});
            }
        }
    );
});


// Insertion d'un post en BDD + envoi d'une notification à tous les abonnés
app.post('/', (req, res) => {
    const query = (
        "INSERT INTO posts(title, body, date, photo) "
        + "VALUES (?, ?, datetime('now'), ?);"
    );
    const params = [req.body.title, req.body.body, req.body.photo];

    // Je créé d'abord mon post
    db.run(query, params, (err) => {
        if(err){
            console.log("DB ERROR : ", err);
            res.status(500);
            res.json({'status': 'nok'});

        }
        else {
            res.status(201);
            res.json({'status': 'created'});

            // Si pas de problème à la création on va créer une notification pour chaque abonné
            db.all('SELECT * FROM subscriptions', [], (err, rows) => {
                // Je parcours un à un mes abonnements
                for(const subscription of rows){
                    // Serialization de l'abonnement
                    const serializedSubscription = {
                        'endpoint': subscription.endpoint,
                        'keys': {
                            'p256dh': subscription.key_p256dh,
                            'auth': subscription.key_auth
                        }
                    };
                    // Notification qu'on envoi
                    const notification = {
                        'title': 'Nouveau post !',
                        'body': 'Venez consulter ' + req.body.title + ' !'
                    };
                    // On laisse webpush se charger de l'envoi
                    webpush.sendNotification(
                        serializedSubscription,
                        JSON.stringify(notification)
                    ).catch(notificationError => {
                        // Si l'abonnement n'existe pas/plus, on le supprime de la BDD
                        if(
                            notificationError.statusCode == 404
                            || notificationError.statusCode == 410
                        ){
                            console.error("A subscription is not valid anymore");
                            db.run("DELETE FROM subscriptions WHERE id = ?", [subscription.id]);
                        }
                    });
                }
            });
        }
    })
});

// L'enregistrement du fichier est automatiquement géré grâce à 
// multer avec uploader.single('photo'). Ici 'photo' correspond
// au nom du champ quand j'ai donné côté front.
app.post('/uploadPhoto', uploader.single('photo'), (req, res) => {
    if(req.file){
        // Si ça c'est bien passé je retourne le chemin vers le nouveau fichier
        // C'est multer qui a rendu req.file accessible, ce n'est pas présent par défaut avec express
        res.send(req.file.path);
    } else {
        res.status(500);
        res.send("Couldn't upload file");
    }
})

app.listen(port, () => {
    console.log("Server launched on localhost:8000");
});