const path = require("path")
const fs = require("fs")
require("dotenv").config({ path: path.resolve(process.cwd(), ".env.local") })
const { MONGODB_URI, MONGODB_DB } = process.env

const { MongoClient } = require("mongodb");
// Replace the uri string with your MongoDB deployment's connection string.
const client = new MongoClient(MONGODB_URI);

async function createManifest() {
  try {
    await client.connect();
    const database = client.db(MONGODB_DB);
    const customers = database.collection('customers');
    // Query for a movie that has the title 'Back to the Future'
    // const query = { title: 'Back to the Future' };
    const data = await customers.find({}).toArray();
    fs.writeFile("./manifest.json", JSON.stringify(data), (err) => {
      if (err) throw err
      console.info("Global data manifest written to file")
    })
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

async function main() {
  try {
    await createManifest()
  } catch (err) {
    throw new Error(err)
  }
}

main()
