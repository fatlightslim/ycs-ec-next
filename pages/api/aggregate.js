import { connectToDatabase } from "../../util/mongodb"

export default async (req, res) => {
  const { db } = await connectToDatabase()
  const response = await db
    .collection("orders")
    .aggregate([
      {
        $match: { status: {$nin: ["deleted"]}, collector: { $exists: true } },
      },
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
            as: "product",
          },
        },
    //   {
    //     $lookup: {
    //       from: "products",
    //       let: { product_id: "$product_id" },
    //       pipeline: [
    //         {
    //           $match: {
    //             $expr: {
    //               $and: [{ $eq: ["$$product_id", "$id"] }],
    //             },
    //           },
    //         },
    //       ],
    //       as: "product",
    //     },
    //   },
    ])
    .toArray()
    console.log(response);

  res.json(response)
}
