import express from "express";
import { MongoClient } from "mongodb";
import cors from "cors";
import session from "express-session";
import MongoStore from "connect-mongo";
import path from "path";
import { fileURLToPath } from "url";
import jwt from 'jsonwebtoken';

const app = express();
const port = 5500;

const uri =
  "mongodb+srv://cryptoAdmin:admin@webtechnologycourse.hm9v4is.mongodb.net/?retryWrites=true&w=majority&appName=webTechnologyCourse";
// Remove the unused variable 'database'
// let database;
const SECRET_KEY = 'yourSecretKeyHere';

// Connect to MongoDB outside of the request to reuse the connection
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
app.use(cors({ credentials: true }));
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.json());
app.use(express.static(path.join(__dirname, "../../")));
app.use(
  session({
    secret: "very very secret", // Used to sign the session ID cookie, replace with a real secret in production
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: uri }),
    cookie: { secure: false }, // Set secure: true if using HTTPS
  }),
);

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
    if (user && user.password === password) 
    {
      let token =null;
      token  = generateToken(user); // create a token to the user this token will be avaible for 30min after the it will be invalid and user considered as logged out
      console.log(token);
      res.status(200).json({ success: true, message: "Login successful!" ,token : token });
    } else 
    {
      let msg=""
      if(user===null)
      {
        msg="invalid user name"
      }
      else
      {
        msg="invalid password"
      }
      res.status(401).json({ success: false, message: msg});
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  } finally {
    await client.close();
  }
});

app.post("/userExist", async (req, res) => {
  try {
    console.log("Check user existence");
    await client.connect();
    console.log("Connected to db");
    const database = client.db("webTechnologyCourse");
    console.log("Connected to database");
    const collection = database.collection("users");
    console.log("Connected to collection");
    const { username } = req.body;
    console.log("Received username:", username);
    const user = await collection.findOne({ userName: username });
    console.log("User found in database:", user);
    if (user === null) {
      res.status(200).json({ validName: true, message: "Name is available" });
    } else {
      res.status(200).json({ validName: false, message: "Name is already taken" });
    }
  } catch (err) {
    console.error("Error checking user existence:", err);
    res.status(500).json({ message: err.message });
  } finally {
    await client.close();
  }
});





const generateToken = (user) => {
  // Replace 'YOUR_SECRET_KEY' with your actual secret key
  const secretKey = SECRET_KEY;

  console.log('Secret Key:', secretKey);

  const userData = { id: user._id, userName: user.userName, password: user.password };

  // Token will expire in 30 minutes
  const expiresIn = '10m';

  try {
    const token = jwt.sign(userData, SECRET_KEY, { expiresIn });
    console.log('Generated Token:', token);
    return token;
  } catch (error) {
    console.error('Error generating token:', error);
    throw error; // Rethrow the error to handle it outside this function
  }
};  
// when calling this API, send the token in the request headers
app.get('/profile', (req, res) => {
  const tokenHeader = req.headers.authorization;

  if (!tokenHeader) {
    return res.status(401).json({ loggedIn: false, message: 'No token provided' });
  }

  const token = tokenHeader.split(' ')[1]; // Extract the token from the Authorization header

  // Debugging: Log the received token
  console.log('Received Token:', tokenHeader);

  // Verify the token using the actual secret key
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      // Debugging: Log the error
      console.error('Error verifying token:', err);

      return res.status(403).json({ loggedIn: false, message: 'Failed to authenticate token' });
    }

    // Debugging: Log the decoded information
    console.log('Decoded Token:', decoded);

    res.status(200).json({ loggedIn: true, userId: decoded.id });
  });
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
