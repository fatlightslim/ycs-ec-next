import { connectToDatabase } from "../../../util/mongodb"
const ObjectId = require("mongodb").ObjectID

export default async (req, res) => {
  const { db } = await connectToDatabase()
  const collection = db.collection("products")
  const { data } = req.body
  if (data) {
    data.qty = data.qty ? parseInt(data.qty) : 0
    data.price = data.price ? parseInt(data.price) : 0
    data.sales = data.sales ? parseInt(data.sales) : 0
    data.deleted = data.deleted === "true"
    data.done = data.done === "true"
  }

  switch (req.method) {
    case "DELETE":
      return del()
    case "GET":
      return get()
    case "PATCH":
      return patch()
    case "PUT":
      return put()
    case "POST":
      return post()
    default:
      break
  }

  function put() {
    const { _id, status } = req.body
    // console.log(status);
    collection.findOneAndUpdate(
      { _id: ObjectId(_id) },
      { $set: { ...status, updatedAt: new Date() } },
      { returnOriginal: false },
      (err, r) => {
        if (err) console.log(err)
        res.json(r)
      }
    )
  }

  function del() {
    const { _id } = req.body
    collection.findOneAndUpdate(
      { _id: ObjectId(_id) },
      { $set: { status: "deleted", updatedAt: new Date() } },
      (err, r) => {
        if (err) console.log(err)
        res.json(r)
      }
    )
  }

  function post() {
    data._id = ObjectId()
    data.createdAt = ObjectId(data._id).getTimestamp()
    data.updatedAt = data.createdAt
    collection.insertOne(data, (err, r) => {
      if (err) console.log(err)
      res.json(r.ops[0])
    })
  }

  function patch() {
    const { _id, sales, ...data } = req.body.data
    data.updatedAt = new Date()
    data.deleted = data.deleted === "true"
    data.done = data.done === "true"

    collection.findOneAndUpdate(
      { _id: ObjectId(_id) },
      { $set: data },
      { returnOriginal: false },
      (err, result) => {
        if (err) console.log(err)
        res.json(result)
      }
    )
  }

  async function get() {
    const response = await collection.find({}).toArray()

    res.json(response)
  }
}
