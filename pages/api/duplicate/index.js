// import { ObjectId } from "mongodb"
// import { connectToDatabase } from "../../../util/mongodb"

// export default async (req, res) => {
//   const { db } = await connectToDatabase()

//   const response = await db
//     .collection("orders")
//     .findOne({ _id: ObjectId(id), status: { $in: ["active", "printed"] } })
//   // .find({})
//   // .sort({ updatedAt: -1, createdAt: -1 })
//   // .toArray();

//   res.json(response)
// }
