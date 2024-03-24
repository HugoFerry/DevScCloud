import { ObjectId } from 'mongodb';
import clientPromise from "../../../lib/mongodb";

/**
 * @swagger
 *
 * /api/movie/{idMovie}:
 *   get:
 *     tags:
 *       - Movie
 *     description: Get movie by id
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
 *               $ref: '#/components/schemas/Movie'
 *       500:
 *         description: Server error
 *   put:
 *     tags:
 *       - Movie
 *     description: Update movie by id
 *     parameters:
 *       - in: path
 *         name: idMovie
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Movie'
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Movie'
 *       500:
 *         description: Server error
 *   delete:
 *     tags:
 *       - Movie
 *     description: Delete movie by id
 *     parameters:
 *       - in: path
 *         name: idMovie
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 *       500:
 *         description: Server error
 */


export default async function handler(req, res) {
    const client = await clientPromise;
    const db = client.db("sample_mflix");
    const idMovie = req.query.idMovie

switch (req.method) {
        case "GET":
            try {
                let dbMovie = await db.collection("movies").findOne({_id: new ObjectId(idMovie)});
                if (!dbMovie) {
                    res.status(404).json({ status: 404, message: 'Film non trouvé' });
                }
                else {
                    res.json({status: 200, data: {movie: dbMovie}});
                }
            } catch (e) {
                console.log(e);
                res.status(500).json({status: 500, message: 'Erreur inattendue.'});
            }
            break;

    case "PUT":
        const updateData = req.body;
        delete updateData._id;
        try {
            const updateResult = await db.collection("movies").findOneAndReplace({ _id: new ObjectId(idMovie) }, updateData);
            if (!updateResult) {
                res.status(404).json({ status: 404, message: 'Film non trouvé' });
            } else {
                const updatedMovie = await db.collection("movies").findOne({ _id: new ObjectId(idMovie) });
                res.json({ status: 200, data: { movie: updatedMovie } });
            }
        } catch (e) {
            console.log(updateData);
            console.log(e);
            res.status(500).json({status: 500, message: 'Erreur inattendue.'});
        }
        break;

        case "DELETE":
            let deleteResult;
            try {
                deleteResult = await db.collection('movies').findOneAndDelete({ _id: new ObjectId(idMovie) });
                if (!deleteResult) {
                    res.status(404).json({status: 404, message: 'Film non trouvé.'});
                } else {
                    res.json({ status: 200, message: 'Film supprimé avec succès !' });
                }
            } catch (e) {
                console.log(e);
                res.status(500).json({status: 500, message: 'Erreur inattendue.'});
            }
            break;
    }
}


