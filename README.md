# Projet DevSevCloud

## Installation

Lors de la récupération du projet : 
```bash
cd with-mongodb-app
```
Ensuite, on installe tout les packages nécéssaires au bon fonctionnement de l'application :
```bash
npm install
```

## Configuration

### Mettre en place une base de données MongoDB

Pout mettre en place une base de données MongoDB rendez-vous sur Mongo DB :
https://mongodb.com/fr-fr

Il faudra ensuite se connecter et vous créer une base de données.


### Mettre en place les variables d'environment

Afin de faire fonctionner le fichier, il faudra dans notre dossier `with-mongodb-app` créer un fichier :

`.env.local` ( Fichier à faire ignorer par GIT )

```bash
cp .env.local .env.local
```

Définir les variables d'environnement dans le fichier `.env.local`:

- `MONGODB_URI` - Votre lien de connexion à votre base de données. Si vous utilisez [MongoDB Atlas](https://mongodb.com/atlas) vous pourrez le trouver en cliquant sur le bouton "Connect" de votre cluster.

### Run Next.js in development mode

```bash
npm run dev
```

## Stack technique

Ce projet a été réalisé en javascript avec le framework next.js. Il est connecté à une base données MongoDB.
Un swagger a été mis en place avec la librairie "swagger-ui".

