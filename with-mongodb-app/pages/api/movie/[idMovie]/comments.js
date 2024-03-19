import clientPromise from "../../lib/mongodb";
export default async function handler(req, res) {

    const client = await clientPromise;
    const db = client.db("sample_mflix");

    switch (req.method) {
        case "GET":
            const comments = await db.collection("comments").find({}).limit(10).toArray();
            res.json({ status: 200, data: comments });
            break;
        case "POST":
            let comment = req.body;
            try {
                let newComment = await db.collection("comments").insertOne(comment);
                res.json({ status: 200, data: { movie: newComment } });
            } catch (e) {
                console.log(e)
                res.status(500).json({status: 500, message: 'Erreur inattendue.'});
            }
            break
    }

}