import { ObjectId } from "mongodb";
import { connectToDatabase } from "../../../util/mongodb";

export default async (req, res) => {
  const { db } = await connectToDatabase();
  const {
    query: { _id },
  } = req;

  const response = await db
    .collection("products")
    .find({ dept_id: _id, status: "active" })
    .sort({updatedAt: -1})
    .toArray();

  res.json(response);
};
