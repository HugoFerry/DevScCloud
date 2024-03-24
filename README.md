Projet DevSevCloud
Table des matières
Installation
Configuration
Stack technique
Installation
Pour installer les dépendances nécessaires au lancement du projet, exécutez la commande suivante :

bash
Copy code
npm install
Configuration
Mettre en place une base de données MongoDB
Pour mettre en place une base de données MongoDB, rendez-vous sur le site MongoDB.

Mettre en place les variables d'environnement
Copiez le fichier env.local.example dans le même répertoire et renommez-le en .env.local (Ce fichier sera ignoré par Git) :

bash
Copy code
cp .env.local.example .env.local
Définissez les variables d'environnement dans le fichier .env.local :

env
Copy code
MONGODB_URI=Votre_lien_de_connexion_à_votre_base_de_données
Si vous utilisez MongoDB Atlas, vous pouvez trouver le lien de connexion en cliquant sur le bouton "Connect" de votre cluster.

Stack technique
Ce projet a été réalisé en JavaScript avec le framework Next.js. Il est connecté à une base de données MongoDB. Un Swagger a été mis en place avec la librairie swagger-ui.
