import { connectToDatabase } from "../../../util/mongodb"
import { ObjectId } from "mongodb"

export default async (req, res) => {
  const { db } = await connectToDatabase()
  const collection = db.collection("orders")
  const {
    query: { _id },
  } = req
  const { data } = req.body

  switch (req.method) {
    case "POST":
      return post()
    case "GET":
      return res.json(
        await collection
          .find({ product_id: _id })
          .sort({ updatedAt: -1 })
          .toArray()
      )
    default:
      break
  }

  function post(params) {
    const { status } = data
    collection.findOneAndUpdate(
      { _id: ObjectId(_id) },
      { $set: { status, updatedAt: new Date() } },
      { returnOriginal: false },
      (err, r) => {
        if (err) console.log(err)
        updateProduct(r.value.qty).then((updatedProduct) => {
          res.json({ newOrder: r.value, updatedProduct: updatedProduct.value })
        })
      }
    )
  }

  function updateProduct(qty) {
    return new Promise((resolve) => {
      db.collection("products").findOne(
        { _id: ObjectId(data.product_id) },
        (err, doc) => {
          if (err) console.log(err)

          // doc.sales = doc.sales + qty
          // doc.qty = doc.qty - qty

          db.collection("products").findOneAndUpdate(
            { _id: ObjectId(data.product_id) },
            { $set: { ...doc, updatedAt: new Date() } },
            { returnOriginal: false },
            (err, updatedProduct) => {
              if (err) console.log(err)
              resolve(updatedProduct)
            }
          )
        }
      )
    })
  }
}
