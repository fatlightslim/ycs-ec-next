import { ObjectId } from "mongodb";
import { connectToDatabase } from "../../../util/mongodb";

export default async (req, res) => {
  const { db } = await connectToDatabase();
  const {
    query: { id },
  } = req;

  if (req.method === "POST") {
    // const collection = db.collection("orders");

    // collection
    //   .deleteMany({ region: req.body[0].region })
    //   .then((result) => {
    //     collection.insertMany(req.body, (err, result) => {
    //       if (err) console.log(err);
    //       res.json(result);
    //     });
    //   })
    //   .catch((err) => console.error(`Delete failed with error: ${err}`));
  } else {
    const response = await db
      .collection("products")
      .findOne({ _id: ObjectId(id), status: {$in: ["active", "printed"]} })
      // .find({})
      // .sort({ updatedAt: -1, createdAt: -1 })
      // .toArray();

    res.json(response);
  }
};
