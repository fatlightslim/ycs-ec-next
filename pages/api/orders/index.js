import { connectToDatabase } from "../../../util/mongodb"
const ObjectId = require("mongodb").ObjectID

export default async (req, res) => {
  const { db } = await connectToDatabase()
  const collection = await db.collection("orders")
  const { data, status } = req.body
  if (data) {
    data.qty = data.qty ? parseInt(data.qty) : 1
    data.point = data.point ? parseInt(data.point) : 0
  }

  switch (req.method) {
    case "DELETE":
      return del()
    case "POST":
      return post()
    case "PATCH":
      return patch()
    case "PUT":
      return put().then(r => res.json(r))
    case "GET":
      return get().then((r) => res.json(r))
    default:
      break
  }

  function del(params) {
    const { data } = req.body
    // console.log(data);
    collection.findOneAndUpdate(
      { _id: ObjectId(data._id) },
      { $set: { status: "deleted", updatedAt: new Date() } },
      { returnOriginal: false },
      (err, r) => {
        if (err) console.log(err)
        updateProduct(-r.value.qty).then((updatedProduct) => {
          res.json({ _id: data._id, updatedProduct: updatedProduct.value })
        })
      }
    )
  }

  function patch(params) {
    const { _id } = data
    delete data["_id"]

    data.printed = data.printed === "true"
    data.deleted = data.deleted === "true"
    data.done = data.done === "true"

    collection.findOneAndUpdate(
      { _id: ObjectId(_id) },
      { $set: { ...data, updatedAt: new Date() } },
      // { returnOriginal: false },
      (err, r) => {
        // console.log(r);
        if (err) console.log(err)
        const diffQty = data.qty - r.value.qty
        diffQty !== 0
          ? updateProduct(diffQty).then((updatedProduct) =>
              res.json({
                newOrder: r.value,
                updatedProduct: updatedProduct.value,
              })
            )
          : res.json({ newOrder: r.value, updatedProduct: null })
      }
    )
  }

  function post() {
    data._id = ObjectId()
    data.deleted = false
    data.done = false
    data.printed = false
    data.createdAt = ObjectId(data._id).getTimestamp()
    data.updatedAt = data.createdAt
    collection.insertOne(data, (err, r) => {
      if (err) console.log(err)
      updateProduct(data.qty).then((updatedProduct) => {
        res.json({
          newOrder: r.ops[0],
          updatedProduct: updatedProduct.value,
        })
      })
    })
  }

  function updateProduct(qty) {
    return new Promise((resolve) => {
      db.collection("products").findOne(
        { _id: ObjectId(data.product_id) },
        (err, doc) => {
          if (err) console.log(err)

          doc.sales = doc.sales + qty
          doc.qty = doc.qty - qty

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

  function put(params) {
    const ids = data.map((v) => ObjectId(v._id))
    console.log(data);

    return collection
      .updateMany({ _id: { $in: ids } }, { $set: {status} })
      .then((r) => {
        return r
      })
  }

  function get() {
    return collection
      .aggregate([
        { $match: { status: {$in: ["printed", "active"]}} },
        {
          $addFields: {
            product_id: { $toObjectId: "$product_id" },
          },
        },
        {
          $lookup: {
            from: "products",
            localField: "product_id",
            foreignField: "_id",
            // localField: "_id",
            // foreignField: "product_id",
            as: "product",
          },
        },
      ])
      .toArray()
  }
}
