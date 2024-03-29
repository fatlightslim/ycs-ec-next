import { connectToDatabase } from "../../util/mongodb"

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "20mb",
    },
  },
}

export default async (req, res) => {
  const { db } = await connectToDatabase()
  if (req.method === "POST") {
    // Get the documents collection
    const collection = db.collection("customers")

    if (req.body[0].subRegion) {
      collection
        .deleteMany({ subRegion: req.body[0].subRegion })
        .then((result) => {
          collection.insertMany(req.body, (err, result) => {
            if (err) console.log(err)
            res.json(result)
          })
        })
        .catch((err) => console.error(`Delete failed with error: ${err}`))
    } else {
      collection
        .deleteMany({ region: req.body[0].region })
        .then((result) => {
          collection.insertMany(req.body, (err, result) => {
            if (err) console.log(err)
            res.json(result)
          })
        })
        .catch((err) => console.error(`Delete failed with error: ${err}`))
    }
  } else {
    // Handle any other HTTP method
    const response = await db
      .collection("customers")
      .find({})
      .sort({ updatedAt: -1, createdAt: -1 })
      .toArray()

    res.json(response)
  }
}
