import express from "express";
import { MongoClient } from "mongodb";
import cors from "cors";
import session from "express-session";
import MongoStore from "connect-mongo";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const port = 5500;

const uri =
  "mongodb+srv://cryptoAdmin:admin@webtechnologycourse.hm9v4is.mongodb.net/?retryWrites=true&w=majority&appName=webTechnologyCourse";
// Remove the unused variable 'database'
// let database;

// Connect to MongoDB outside of the request to reuse the connection
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
app.use(cors({}));
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.json());
app.use(express.static(path.join(__dirname, "../../")));
app.use(
  session({
    secret: "very very secret", // Used to sign the session ID cookie, replace with a real secret in production
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: uri }),
    cookie: { secure: true }, // Set secure: true if using HTTPS
  }),
);

app.get("/", function (res) {
  // Remove the unused parameter 'req'
  res.sendFile(path.join(__dirname, "../../index.html"));
});
app.post("/login", async (req, res) => {
  try {
    console.log("login request");
    await client.connect();
    console.log("connected to db");
    const database = client.db("webTechnologyCourse");
    console.log("connected to database");
    const collection = database.collection("users");
    console.log("connected to collection");
    const { username, password } = req.body;
    console.log("username: " + username);
    const user = await collection.findOne({ userName: username });
    console.log("user: " + user);
    if (user && user.password === password) {
      req.session.userId = user._id;
      res.status(200).json({ succeess: true, message: "Login successful!" });
    } else {
      res.status(401).json({ succeess: false, message: "Invalid credentials" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  } finally {
    await client.close();
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

// app.post("/data", async (req, res) => {
//   try {
//     await client.connect();
//     const database = client.db("testdb");
//     const collection = database.collection("testcollection");
//     const result = await collection.insertOne(req.body);
//     res.status(201).json(result.ops[0]);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   } finally {
//     await client.close();
//   }
// });
