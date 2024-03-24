import clientPromise from "../../../../lib/mongodb";
import {ObjectId} from "mongodb";
/**
 * @swagger
 * /api/movie/{idMovie}/comments:
 *   get:
 *     tags:
 *       - Comment
 *     description: Get comments by movie id
 *     parameters:
 *       - in: path
 *         name: idMovie
 *         required: true
 *         schema:
 *           type: string
 *         description: Movie ID
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comment'
 *       500:
 *         description: Server error
 *   post:
 *     tags:
 *       - Comment
 *     description: Add comment to movie by id
 *     parameters:
 *       - in: path
 *         name: idMovie
 *         required: true
 *         schema:
 *           type: string
 *         description: Movie ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Comment'
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *           schema:
 *             $ref: '#/components/schemas/Comment'
 *       500:
 *         description: Server error
 * components:
 *   schemas:
 *     Comment:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         text:
 *           type: string
 *         date:
 *           type: string
 *           format: date-time
 */
export default async function handler(req, res) {

    const client = await clientPromise;
    const db = client.db("sample_mflix");
    const idMovie = req.query.idMovie;

    async function verifyIdMovie(db, idMovie) {
        try {
            const movie = await db.collection("movies").findOne({_id: new ObjectId(idMovie)});
            return movie != null;
        } catch (e) {
            console.log("Error in verifyIdMovie: ", e);
            res.status(400).json({status: 400, message: 'Erreur, ID du film invalide'});
            return false;
        }
    }

    switch (req.method) {
        case "GET":
            if (!await verifyIdMovie(db, idMovie)) {
                res.status(404).json({status: 404, message: 'Film non trouvé.'});
                return;
            }

            try {
                let comments = await db.collection("comments").find({movie_id: new ObjectId(idMovie)}).limit(10).toArray();
                res.json({ status: 200, data: comments });
            } catch (e) {
                console.log(e)
                res.status(500).json({status: 500, message: 'Erreur inattendue.'});
            }
            break;
        case "POST":
            let comment = req.body;
            comment.movie_id = new ObjectId(idMovie);

            if (!await verifyIdMovie(db, idMovie)) {
                res.status(404).json({status: 404, message: 'Film non trouvé.'});
                return;
            }

            try {
                let newComment = await db.collection("comments").insertOne(comment);
                res.json({ status: 200, data: { movie: newComment } });
            } catch (e) {
                console.log(e)
                res.status(500).json({status: 500, message: 'Erreur inattendue.'});
            }
            break;
    }
}