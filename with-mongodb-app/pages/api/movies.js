import clientPromise from "../../lib/mongodb";

/**
 * @swagger
 * tags:
 *   - name: Movie
 *     description: EndPoints for Movie
 *   - name: Comment
 *     description: EndPoints for Comments
 *
 * /api/movies:
 *   get:
 *     tags:
 *       - Movie
 *     description: Get movies
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Movie'
 *   post:
 *     tags:
 *       - Movie
 *     description: Create Movie
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Movie'
 *     responses:
 *       200:
 *         description: success
 * components:
 *   schemas:
 *     Movie:
 *       type: object
 *       properties:
 *         plot:
 *           type: string
 *         genres:
 *           type: array
 *           items:
 *             type: string
 *         runtime:
 *           type: integer
 *         cast:
 *           type: array
 *           items:
 *             type: string
 *         num_mflix_comments:
 *           type: integer
 *         title:
 *           type: string
 *         fullplot:
 *           type: string
 *         languages:
 *           type: array
 *           items:
 *             type: string
 *         released:
 *           type: string
 *           format: date-time
 *         directors:
 *           type: array
 *           items:
 *             type: string
 *         rated:
 *           type: string
 *         awards:
 *           type: object
 *           properties:
 *             wins:
 *               type: integer
 *             nominations:
 *               type: integer
 *             text:
 *               type: string
 *         lastupdated:
 *           type: string
 *         year:
 *           type: integer
 *         imdb:
 *           type: object
 *           properties:
 *             rating:
 *               type: number
 *             votes:
 *               type: integer
 *             id:
 *               type: integer
 *         countries:
 *           type: array
 *           items:
 *             type: string
 *         type:
 *           type: string
 *         tomatoes:
 *           type: object
 *           properties:
 *             viewer:
 *               type: object
 *               properties:
 *                 rating:
 *                   type: integer
 *                 numReviews:
 *                   type: integer
 *                 meter:
 *                   type: integer
 *             lastUpdated:
 *               type: string
 */

export default async function handler(req, res) {

    const client = await clientPromise;
    const db = client.db("sample_mflix");

    switch (req.method) {
        case "GET":
            const movies = await db.collection("movies").find({}).limit(10).toArray();
            res.json({ status: 200, data: movies });
            break;
        case "POST":
            let movie = req.body;
            try {
                let newMovie = await db.collection("movies").insertOne(movie);
                    res.json({ status: 200, data: { movie: newMovie } });
            } catch (e) {
                console.log(e)
                res.status(500).json({status: 500, message: 'Erreur inattendue.'});
            }
            break
    }
}