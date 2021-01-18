import { connectToDatabase } from "../../util/mongodb"
const ObjectId = require("mongodb").ObjectID

export default async (req, res) => {
  const { db } = await connectToDatabase()
  const collection = db.collection("depts")

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

  function patch(params) {
    const { _id, ...data } = req.body.data
    data.deleted = data.deleted === "true"

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
    data.deleted = false
    data.createdAt = ObjectId(data._id).getTimestamp()
    data.updatedAt = data.createdAt
    collection.insertOne(data, (err, r) => {
      if (err) console.log(err)
      res.json(r.ops[0])
    })
  }

  async function get() {
    const response = await db
      .collection("depts")
      .find({ status: "active" })
      .toArray()
      // console.log(response);
    res.json(response)
  }

  function put() {
    const { _id, ...data } = req.body
    data.deleted = data.deleted === "true"
    data.done = data.done === "true"
    collection.findOneAndUpdate(
      { name: data.name },
      { $set: data },
      { returnOriginal: false },
      (err, result) => {
        if (err) console.log(err)
        res.json(result)
      }
    )
  }
}
