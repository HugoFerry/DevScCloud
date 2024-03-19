import clientPromise from "../../lib/mongodb";
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