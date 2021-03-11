import { ObjectId } from "mongodb"
import { connectToDatabase } from "../../../util/mongodb"

export default async (req, res) => {
  const { db } = await connectToDatabase()
  const {
    query: { id },
  } = req

  if (req.method === "POST") {
    const order = await db
      .collection("orders")
      .findOne({ _id: ObjectId(id) }, async (err, order) => {
        await db
          .collection("products")
          .findOne({ _id: ObjectId(order.product_id) }, async (err, r) => {
            order.product = [r]
            res.json(order)
          })
      })

  } else {
    const response = await db
      .collection("products")
      .findOne({ _id: ObjectId(id), status: { $in: ["active", "printed"] } })
    // .find({})
    // .sort({ updatedAt: -1, createdAt: -1 })
    // .toArray();

    res.json(response)
  }
}
