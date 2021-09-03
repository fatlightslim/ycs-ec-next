require("dotenv").config({ path: "./.env.local" })
const fs = require("fs")
const MongoClient = require("mongodb").MongoClient
const { MONGODB_URI, MONGODB_DB } = process.env

console.log(process.argv[2])
const collection = process.argv[2]

const client = new MongoClient(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

const excludeDepts = ["Ckxj0MUF2L16d4f4ELjG", "kd8c2VInnobDeS7hxOeu"]

fs.readFile(`${__dirname}/json/${collection}.json`, "utf-8", (err, data) => {
  if (err) throw err // 例外発生時の処理
  let table = collection
  if (collection === "depts") {
    table = "departments"
  }
  const json = JSON.parse(data)[table]
  let array = []

  Object.keys(json).forEach((v) => {
    array.push(json[v])
  })

  if (collection === "depts") {
    array = array.filter((v) => !excludeDepts.includes(v.id))
    array = array.map((v) => {
      if (v.id === "WY11IJ6B58TwaguXdMXK") {
        v.name = "東金"
        v.customers = "togane"
      }
      return v
    })
  }

  client.connect(async function (err) {
    console.log("Connected successfully to server")

    const db = client.db()

    const depts = await db.collection("depts").find({}).toArray()
    const products = await db.collection("products").find({}).toArray()
    const orders = await db.collection("orders").find({}).toArray()
    const productsIdPair = {}
    products.forEach((v) => {
      productsIdPair[v.old_id] = v._id.toString()
    })

    const result = array.map((v, i) => {
      const {
        division,
        deleted,
        printed,
        done,
        point,
        qty,
        updated,
        updatedAt,
        sales,
        department,
        dept,
        product,
        id,
        old_id,
        timestamp,
        ...rest
      } = v
      switch (collection) {
        case "depts":
          return {
            person: "所長 館坂 民和",
            status: "active",
            createdAt: new Date(timestamp) || new Date(),
            updatedAt: new Date(),
            old_id: id,
            ...rest,
          }
        case "products":
          const filtered = depts.filter((x) => {
            let dept_id = department
            if ("Ckxj0MUF2L16d4f4ELjG" === department) {
              dept_id  = "fNhboDabBd0pw0tlO9n8"
            } else if ("kd8c2VInnobDeS7hxOeu" === department) {
              dept_id = "WY11IJ6B58TwaguXdMXK"
            }
            return x.old_id === dept_id
          })
          const salesToInteger =
            sales === 0 || v.price === 0 ? 0 : sales / v.price
          if (isNaN(parseInt(qty))) console.log(v)


          return {
            status: done ? "done" : deleted ? "deleted" : "active",
            qty: parseInt(qty) ? parseInt(qty) : 0,
            sales: salesToInteger,
            dept_id: filtered.length > 0 ? filtered[0]._id.toString() : "",
            createdAt: new Date(timestamp),
            updatedAt: updated ? new Date(updated) : new Date(),
            old_id,
            ...rest,
          }
        case "orders":
          return {
            status: printed
              ? "printed"
              : done
              ? "done"
              : deleted
              ? "deleted"
              : "active",
            point: point ? parseInt(point) : 0,
            qty: parseInt(qty),
            product_id: productsIdPair[product],
            createdAt: new Date(timestamp),
            updatedAt: new Date(timestamp),
            old_id,
            ...rest,
          }
        default:
          break
      }
    })

    // console.log(result)
    // Use connect method to connect to the Server

    db.collection(collection).drop()
    db.collection(collection).insertMany(result, (err, result) => {
      if (err) console.log(err)
      client.close()
    })
  })
})
