<img src="logo-epsi2.png" width="20%" height="20%"/>  


## **EPSI BORDEAUX - I1 EISI**

# Atelier - Développement et Service Cloud - Tips Swagger UI

| Code Module   | Durée | Titre Diplôme         | Bloc de Compétences      | Promotion      | Auteur  |
|--------------|-------------|-----------------------|-------------------------|------------------------|--------|
| DEVE844      | 14h   | EISI / RNCP 35584 | Concevoir & Développer des solutions applicatives métiers      | 2023/2024      | Julien COURAUD   |

# 1. Mise en place d'une documentation Swagger

## 1.1 Qu'est ce Swagger ?

La documentation Swagger est un ensemble de spécifications et d'outils qui permettent de décrire, de documenter et de tester les API RESTful. Elle peut être utilisée pour générer automatiquement des clients de service, des kits de développement logiciel et des tests de service.

Elle est devenue un standard pour la documentation d'API RESTful en raison de sa simplicité, de sa flexibilité et de sa prise en charge par une grande variété de langages de programmation et de frameworks.

## 1.2 SwaggerUI et React

Afin d'illustrer au mieux vos routes, vous proposerez une page type Swagger, servant de documentation en ligne de votre API REST.

Vous utiliserez les librairies "next-swagger-doc" et "swagger-ui-react".

``` json
// package.json
"next-swagger-doc": "^0.1.9",
"swagger-ui-react": "^3.52.3",
"btoa": "^1.2.1",
"formdata-node": "^6.0.3"
```

``` javascript
// pages/swagger/index.jsx

import Head from 'next/head';

import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

const Swagger = () => {

  return (
      <div>
        <Head>
          <title>BrowserStack Demo API</title>
          <meta name="description" content="BrowserStack Demo API Swagger" />
          <link rel="icon" href="/favicon.svg" />
        </Head>
        <SwaggerUI url="/api/doc" />
      </div>
  );
};

export default Swagger;

```

``` javascript
// pages/api/doc.js

import { withSwagger } from 'next-swagger-doc';

const swaggerHandler = withSwagger({
  openApiVersion: '3.0.0',
  title: 'BrowserStack Demo API',
  version: '1.0.0',
  apiFolder: 'pages/api',

});
export default swaggerHandler();

```
``` javascript

//pages/api/movies.js

/**
 * @swagger
 * /api/movies:
 *   get:
 *     description: Returns movies
 *     responses:
 *       200:
 *         description: Hello Movies
 */
 export default async function handler(req, res) {
  //........
 }
```
## 1.3 Liens utiles

- https://www.npmjs.com/package/next-swagger-doc
- https://www.npmjs.com/package/swagger-ui-react

# 2. Query parameters

## 2.1 Utilisation et contexte

Les "Query Params" sont des paramètres optionnels de type clé/valeur directement passés dans l'URL. On trouvera les informations variables à transmettre après l'URL du endpoint suite à un point d'interrogation ```?```. S'il existe plusieurs paramètres à transmettre, ils seront séparés d'un ```&```.

Cette méthode est à utiliser quand il s'agit de paramètres optionnels et peu nombreux, comme par exemple des options de recherches.

Exemple: ```https://my-custom-api/api/movies/search?sortByTitle=ASC&page=2``` (pour demander la page 2 des films triés dans l'ordre alphabétique de leur titre).

## 2.2 Code SwaggerUI

Prenons l'exemple, comme ci-dessus, d'une gestion des filtres de recherches pour un affichage paginé des films sur une application web.

```javascript
// File: my-nextjs-project/pages/api/movies/search.js

/**
* @swagger
* /api/movies/search:
*   get:
*     description: Endpoint which return the filtered part of movies to display
*     parameters:
*       - in: query
*         name: sortByTitle
*         required: false
*         type: string
*         description: Type of sorting to use on movies list
*       - in: query
*         name: page
*         required: true
*         type: integer
*         description: Number of current page to display on movies list
*/
export default function handler(req, res) {

  const queryParams = req.query;

  if (queryParams) {

    // Here your DB access and your ressource manipulation logic

    res.json({ status: 200, data: {message: "Success"} });

  }
  else {

    res.json({ status: 400, data: {message: "Error"} });

  }
}
```

# 3. Path parameters

## 3.1 Utilisation

Les "Path Params" sont également des paramètres présents dans l'URL du endpoint mais cette fois-ci il s'agit d'un identificateur unique associé à une ou des ressources bien particulières.

Cette méthode est donc plutôt à utiliser lorsque nous avons la possibilité de directement donner l'information sur la ou les ressources concernées, le plus souvent via un ID.

Exemple: ```https://my-custom-api/api/movie/1234``` (pour récupérer les informations du film associé à l'ID "1234").

## 3.2 Code SwaggerUI

Prenons l'exemple de la récupération des informations relatives à un film spécifique identifié via son ID technique.

```javascript
// File: my-nextjs-project/pages/api/movie/[idMovie].js

/**
* @swagger
* /api/movies/{idMovie}:
*   get:
*     description: Endpoint which returns movie data
*     parameters:
*       - in: path
*         name: idMovie
*         required: true
*         schema:
*           type: string
*         description: ID movie
*     responses:
*       200:
*         description: Success Response
*       400:
*         description: Error Response
*/
export default function handler(req, res) {

  const { idMovie } = req.query;

  if (idMovie) {

    // Here your DB access and your ressource manipulation logic

    res.json({ status: 200, data: {message: "Success"} });

  }
  else {

    res.json({ status: 400, data: {message: "Error"} });

  }
}
```

# 4. Body parameters

## 4.1 Utilisation

Les "Body Params" sont des paramètres passés sous la forme d'objets JSON directement au sein des métadonnées de la requête HTTP.

On utilisera cette méthode plutôt dans le cas de plusieurs paramètres, pouvant avoir des types différents (String, Integer, etc...).

Il existe plusieurs types de "Body Params", nous utiliserons dans le cadre du projet la méthode "x-www-form-urlencoded" qui permet de manipuler des objets JSON classiques. On remarquera également la méthode "form-data" spécialement conçue pour l'envoi de données issues de formulaires.

L'utilisation des "Body Params" ne peut pas fonctionner lors d'appels GET aux API.

## 4.2 Code SwaggerUI

Prenons ici l'exemple d'un ajout de commentaire. Cela nécessite plusieurs données variables comme notamment l'identificateur de l'utilisateur, l'identificateur du film à commenter, et le commentaire posté.

```javascript
// File: my-nextjs-project/pages/api/movies/addComment.js

/**
* @swagger
* /api/movies/addComment:
*   post:
*     requestBody:
*       description: Endpoint for adding an comment from a user on a specific movie.
*       content:
*         application/x-www-form-urlencoded:
*           schema:
*             type: object
*             required:
*               - idUser
*               - idMovie
*               - comment
*             properties:
*               idUser:
*                 type: string
*                 description: user identity
*               idMovie:
*                 type: string
*                 description: movie identity
*               comment:
*                 type: string
*                 description: comment to post
*     responses:
*       200:
*         description: Success Response
*       400:
*         description: Error Response
*/
export default async function handler(req, res) {

  const bodyParams = req.body;

  if (bodyParams) {

    // Here your DB access and your ressource manipulation logic

    res.json({ status: 200, data: {message: "Success"} });

  }
  else {

    res.json({ status: 400, data: {message: "Error"} });

  }
}
```
