import express from "express";
import { MongoClient } from "mongodb";
import cors from "cors";
import session from "express-session";
import MongoStore from "connect-mongo";
import path from "path";
import { fileURLToPath } from "url";
import jwt from "jsonwebtoken";

const app = express();
const port = 5500;

const uri =
  "mongodb+srv://cryptoAdmin:admin@webtechnologycourse.hm9v4is.mongodb.net/?retryWrites=true&w=majority&appName=webTechnologyCourse";
// Remove the unused variable 'database'
// let database;
const SECRET_KEY = "yourSecretKeyHere";

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
  })
);

app.post("/walletBalance", async (req, res) => {
  try {
    await client.connect();
    const database = client.db("webTechnologyCourse");
    console.log("connected to database");
    const collection = database.collection("users");
    console.log("connected to collection");
    const { username } = req.body;
    console.log("username: " + username);
    const user = await collection.findOne({ userName: username });
    console.log("user:\n " + user);
    console.log("user coins:");
    user.coins.forEach((coin) => {
      console.log(coin);
    });
    console.log("user balance:\n " + user.balance);
    return res.status(200).json({
      success: true,
      userCoins: user.coins,
      userBalance: user.balance,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  } finally {
    await client.close();
  }
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
      let token = null;
      token = generateToken(user); // create a token to the user this token will be avaible for 30min after the it will be invalid and user considered as logged out
      console.log(token);
      res.status(200).json({
        success: true,
        message: "Login successful!",
        token: token,
        userName: user.userName,
        balance: user.balance,
      });
    } else {
      let msg = "";
      if (user === null) {
        msg = "invalid user name";
      } else {
        msg = "invalid password";
      }
      res.status(401).json({ success: false, message: msg });
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
      res
        .status(200)
        .json({ validName: false, message: "Name is already taken" });
    }
  } catch (err) {
    console.error("Error checking user existence:", err);
    res.status(500).json({ message: err.message });
  } finally {
    await client.close();
  }
});

app.post("/register", async (req, res) => {
  try {
    console.log("Check user existence");
    await client.connect();
    console.log("Connected to db");
    const database = client.db("webTechnologyCourse");
    console.log("Connected to database");
    const collection = database.collection("users");
    console.log("Connected to collection");

    // Extract data from request body
    const { userName, password } = req.body;

    // Default values for coins array and balance
    const coins = [
      { coinName: "Bitcoin", amount: 1.2 },
      { coinName: "Litecoin", amount: 10 },
    ];
    const balance = 1000;

    // Create user object
    const user = {
      password,
      balance,
      coins,
      userName,
    };

    // Insert user into the database
    await collection.insertOne(user);
    // Respond with success message
    res
      .status(200)
      .json({ registerStatus: true, message: "User registered successfully" });
  } catch (err) {
    console.error("Error registering user:", err);
    res.status(201).json({ registerStatus: false, message: err.message });
  } finally {
    await client.close();
  }
});

app.post("/purchase", async (req, res) => {
  try {
    console.log("Applying user purchase");
    await client.connect();
    console.log("Connected to database");

    const database = client.db("webTechnologyCourse");
    const collection = database.collection("users");

    // Extract data from request body
    const { username, coinAmount, coinName, payment } = req.body;

    // Find the user in the database
    const user = await collection.findOne({ userName: username });
    console.log("User found in database:", user);

    // Decrease the user's balance by the payment amount
    const updatedBalance = user.balance - payment;

    // Check if the coin already exists in the user's coins list
    const coinIndex = user.coins.findIndex(
      (coin) => coin.coinName === coinName
    );
    if (coinIndex !== -1) {
      // If the coin exists, increase the amount
      user.coins[coinIndex].amount += parseFloat(coinAmount); // Parse coinAmount to float before addition
    } else {
      // If the coin doesn't exist, add it to the list
      user.coins.push({ coinName: coinName, amount: parseFloat(coinAmount) }); // Parse coinAmount to float
    }

    // Update the user's document in the database
    await collection.updateOne(
      { userName: username },
      { $set: { balance: updatedBalance, coins: user.coins } }
    );

    console.log("User updated successfully");
    res.status(200).json({
      success: true,
      message: "Purchase successful",
      balance: updatedBalance,
    });
  } catch (err) {
    console.error("Error applying purchase:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  } finally {
    await client.close();
  }
});

app.post("/updateSell", async (req, res) => {
  try {
    console.log("Applying user sell action");
    await client.connect();
    console.log("Connected to database");

    const database = client.db("webTechnologyCourse");
    const collection = database.collection("users");

    // Extract data from request body
    const { userName, coinName, newCoinsInWallet, newBalance } = req.body;

    // Find the user in the database
    const user = await collection.findOne({ userName: userName });
    console.log("User found in database:", user);

    // Check if the coin already exists in the user's coins list
    const coinIndex = user.coins.findIndex(
      (coin) => coin.coinName === coinName
    );
    if (coinIndex !== -1) {
      // If the coin exists, increase the amount
      user.coins[coinIndex].amount = parseFloat(newCoinsInWallet); // update the new amount of coin in the user data
    } else {
      // If the coin doesn't exist, add it to the list
      throw new Error("no such coin in wallet");
    }

    // Update the user's document in the database
    await collection.updateOne(
      { userName: userName }, // Corrected variable name
      { $set: { balance: newBalance, coins: user.coins } }
    );

    console.log("User sell action updated successfully");
    res.status(200).json({
      success: true,
      message: "sell action successful",
      balance: newBalance,
    });
  } catch (err) {
    console.error("Error completeing the sell action:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  } finally {
    await client.close();
  }
});

const generateToken = (user) => {
  // Replace 'YOUR_SECRET_KEY' with your actual secret key
  const secretKey = SECRET_KEY;

  console.log("Secret Key:", secretKey);

  const userData = {
    id: user._id,
    userName: user.userName,
    password: user.password,
  };

  // Token will expire in 30 minutes
  const expiresIn = "10m";

  try {
    const token = jwt.sign(userData, SECRET_KEY, { expiresIn });
    console.log("Generated Token:", token);
    return token;
  } catch (error) {
    console.error("Error generating token:", error);
    throw error; // Rethrow the error to handle it outside this function
  }
};
// when calling this API, send the token in the request headers
app.get("/profile", (req, res) => {
  const tokenHeader = req.headers.authorization;

  if (!tokenHeader) {
    return res
      .status(401)
      .json({ loggedIn: false, message: "No token provided" });
  }

  const token = tokenHeader.split(" ")[1]; // Extract the token from the Authorization header

  // Debugging: Log the received token
  console.log("Received Token:", tokenHeader);

  // Verify the token using the actual secret key
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      // Debugging: Log the error
      console.error("Error verifying token:", err);

      return res
        .status(403)
        .json({ loggedIn: false, message: "Failed to authenticate token" });
    }

    // Debugging: Log the decoded information
    console.log("Decoded Token:", decoded);

    res.status(200).json({ loggedIn: true, userId: decoded.id });
  });
});

app.get("/userData", async (req, res) => {
  try {
    const userName = req.headers.authorization;
    console.log("from userData:", userName);

    if (!userName) {
      return res
        .status(401)
        .json({ success: false, message: "No userName provided" });
    }
    await client.connect();
    console.log("Connected to database");

    const database = client.db("webTechnologyCourse");
    const collection = database.collection("users");
    // Find the user in the database
    const user = await collection.findOne({ userName: userName });

    console.log("User found in database:", user);

    res
      .status(200)
      .json({ success: true, message: "user Data Found", userData: user });
  } catch (err) {
    console.error("Error fetching user Data:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  } finally {
    await client.close();
  }
});

app.get("/", (req, res) => {
  res.send("Server is working!");
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
