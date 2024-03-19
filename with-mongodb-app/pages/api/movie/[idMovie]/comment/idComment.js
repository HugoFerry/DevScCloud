import { ObjectId } from 'mongodb';
import clientPromise from "../../../lib/mongodb";
export default async function handler(req, res) {
    const client = await clientPromise;
    const db = client.db("sample_mflix");
    const idComment = req.query.idComment
    //Verifier IdMovie

    switch (req.method) {
        case "GET":
            try {
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


