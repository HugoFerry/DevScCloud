import { ObjectId } from 'mongodb';
import clientPromise from "../../../../../lib/mongodb";

/**
 * @swagger
 * /api/movie/{idMovie}/comment/{idComment}:
 *   get:
 *     tags:
 *       - Comment
 *     description: Get comment by movie id and comment id
 *     parameters:
 *       - in: path
 *         name: idMovie
 *         required: true
 *         schema:
 *           type: string
 *         description: Movie ID
 *       - in: path
 *         name: idComment
 *         required: true
 *         schema:
 *           type: string
 *         description: Comment ID
 *     responses:
 *       200:
 *         description: success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *   put:
 *     tags:
 *       - Comment
 *     description: Update comment by movie id and comment id
 *     parameters:
 *       - in: path
 *         name: idMovie
 *         required: true
 *         schema:
 *           type: string
 *         description: Movie ID
 *       - in: path
 *         name: idComment
 *         required: true
 *         schema:
 *           type: string
 *         description: Comment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Comment'
 *     responses:
 *       200:
 *         description: success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       500:
 *         description: Server error
 *   delete:
 *     tags:
 *       - Comment
 *     description: Delete comment by movie id and comment id
 *     parameters:
 *       - in: path
 *         name: idMovie
 *         required: true
 *         schema:
 *           type: string
 *         description: Movie ID
 *       - in: path
 *         name: idComment
 *         required: true
 *         schema:
 *           type: string
 *         description: Comment ID
 *     responses:
 *       200:
 *         description: success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */

export default async function handler(req, res) {
    const client = await clientPromise;
    const db = client.db("sample_mflix");
    const idMovie = req.query.idMovie
    const idComment = req.query.idComment

    async function verifyIdMovie (db, idMovie){
        try {
            const movie = await db.collection("movies").findOne({_id: new ObjectId(idMovie)})
            if(movie == null) {
                console.log("Film non trouvé: ", idMovie);
                res.status(404).json({status: 404, message: 'Film non trouvé'});
                return false;
            } else {
                console.log("Film Trouvé: ", movie);
                return true;
            }
        } catch (e){
            console.log("Error in verifyIdMovie: ", e);
            res.status(404).json({status: 404, message: 'Erreur, Film Inexistant'});
            return false;
        }
    }


    switch (req.method) {
        case "GET":
            try {
                const movieFound = await verifyIdMovie(db, idMovie);
                if (!movieFound) {
                    return;
                }
                let dbComment = await db.collection("comments").findOne({_id: new ObjectId(idComment)});
                if (!dbComment) {
                    res.status(404).json({ status: 404, message: 'Commentaire non trouvé' });
                }
                else {
                    res.json({status: 200, data: {comment: dbComment}});
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
                const movieFound = await verifyIdMovie(db, idMovie);
                if (!movieFound) {
                    return;
                }
                const updateResult = await db.collection("comments").findOneAndReplace({ _id: new ObjectId(idComment) }, updateData);
                if (!updateResult) {
                    res.status(404).json({ status: 404, message: 'Commentaire non trouvé' });
                } else {
                    const updatedComment = await db.collection("comments").findOne({ _id: new ObjectId(idComment) });
                    res.json({ status: 200, data: { comment: updatedComment } });
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
                const movieFound = await verifyIdMovie(db, idMovie);
                if (!movieFound) {
                    return;
                }
                deleteResult = await db.collection('comments').findOneAndDelete({ _id: new ObjectId(idComment) });
                if (!deleteResult) {
                    res.status(404).json({status: 404, message: 'Commentaire non trouvé.'});
                } else {
                    res.json({ status: 200, message: 'Commentaire supprimé avec succès !' });
                }
            } catch (e) {
                console.log(e);
                res.status(500).json({status: 500, message: 'Erreur inattendue.'});
            }
            break;
    }
}


