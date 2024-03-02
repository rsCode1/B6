import express from "express";
import { MongoClient } from "mongodb";

const app = express();
const port = 5500;

const uri =
  "mongodb+srv://cryptoAdmin:admin@webtechnologycourse.hm9v4is.mongodb.net/?retryWrites=true&w=majority&appName=webTechnologyCourse";
let database; // Define the database variable outside

// Connect to MongoDB outside of the request to reuse the connection
const client = new MongoClient(uri);
client
  .connect()
  .then(() => {
    database = client.db("webTechnologyCourse");
    console.log("Connected to database");
  })
  .catch((err) => {
    console.error("Failed to connect to database:", err);
  });

app.get("/data", async (req, res) => {
  try {
    const collection = database.collection("users");
    const data = await collection.find({}).toArray();
    if (data.length > 0) {
      console.log(data[0]); // Print the first object from the users collection
      res.json(data[0]); // Send the first object as a response
    } else {
      throw new Error("No data found in the users collection");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred: " + err.message);
  }
});
