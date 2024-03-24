import express from "express";
import { MongoClient } from "mongodb";
import cors from "cors";
import session from "express-session";
import MongoStore from "connect-mongo";
import path from "path";
import { fileURLToPath } from "url";
import jwt from "jsonwebtoken";

//server setup
//connect to the database
//create the express app
//listen to the port 5500
//create the secret key for the jwt token
//create the client for the database
//use the cors to allow the requests from the frontend
//use the express.json to parse the request body
//use the express.static to serve the static files
//use the express-session to create the session for the user
//create the routes for the deposit, login, register, purchase, sell, profile, userData, AlluserData

const app = express();
const port = 5500;

const uri =
  "mongodb+srv://cryptoAdmin:admin@webtechnologycourse.hm9v4is.mongodb.net/?retryWrites=true&w=majority&appName=webTechnologyCourse";

const SECRET_KEY = "yourSecretKeyHere";

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
//handles deposit request
// query the user from the database
// update the balance of the user
app.post("/deposit", async (req, res) => {
  try {
    await client.connect();
    const database = client.db("webTechnologyCourse");
    const collection = database.collection("users");
    const { username, amount } = req.body;
    const user = await collection.findOne({ userName: username });
    const updatedBalance = user.balance + parseFloat(amount);
    await collection.updateOne(
      { userName: username },
      { $set: { balance: updatedBalance } }
    );
    res.status(200).json({
      success: true,
      message: `Deposited ${amount}$ successfully\n`,
      balance: updatedBalance,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  } finally {
    await client.close();
  }
});
//handles wallet balance request
// query the user from the database
// send the user coins and balance to the user
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

//handles login request
// query the user from the database
// check the password
// create a token and send it to the user
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
      token = generateToken(user);
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

//handles register detals validation
// check if the username is already taken
// if not taken register the user
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

//handles register request
// check if the username is already taken
// if not taken register the user
app.post("/register", async (req, res) => {
  try {
    console.log("Check user existence");
    await client.connect();
    console.log("Connected to db");
    const database = client.db("webTechnologyCourse");
    console.log("Connected to database");
    const collection = database.collection("users");
    console.log("Connected to collection");

    const { userName, password } = req.body;

    // Default values for new user
    const coins = [
      { coinName: "Bitcoin", amount: 1.2 },
      { coinName: "Litecoin", amount: 10 },
    ];
    const balance = 1000;

    const user = {
      password,
      balance,
      coins,
      userName,
    };

    await collection.insertOne(user);
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

//handles purchase request
// query the user from the database
// check if the user has enough balance
// purchase the coin and update the balance

app.post("/purchase", async (req, res) => {
  try {
    console.log("Applying user purchase");
    await client.connect();
    console.log("Connected to database");

    const database = client.db("webTechnologyCourse");
    const collection = database.collection("users");

    const { username, coinAmount, coinName, payment } = req.body;

    const user = await collection.findOne({ userName: username });
    console.log("User found in database:", user);

    const updatedBalance = user.balance - payment;

    const coinIndex = user.coins.findIndex(
      (coin) => coin.coinName === coinName
    );
    if (coinIndex !== -1) {
      user.coins[coinIndex].amount += parseFloat(coinAmount);
    } else {
      user.coins.push({ coinName: coinName, amount: parseFloat(coinAmount) });
    }

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

//handles sell request
// query the user from the database
// check if the user has enough coins
// sell the coin and update the balance
app.post("/updateSell", async (req, res) => {
  try {
    console.log("Applying user sell action");
    await client.connect();
    console.log("Connected to database");

    const database = client.db("webTechnologyCourse");
    const collection = database.collection("users");

    const { userName, coinName, newCoinsInWallet, newBalance } = req.body;

    const user = await collection.findOne({ userName: userName });
    console.log("User found in database:", user);

    const coinIndex = user.coins.findIndex(
      (coin) => coin.coinName === coinName
    );
    if (coinIndex !== -1) {
      user.coins[coinIndex].amount = parseFloat(newCoinsInWallet);
    } else {
      throw new Error("no such coin in wallet");
    }

    await collection.updateOne(
      { userName: userName },
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
    throw error;
  }
};

//handles the profile request
// check if the token is provided
// verify the token
// send the user id to the user
app.get("/profile", (req, res) => {
  const tokenHeader = req.headers.authorization;

  if (!tokenHeader) {
    return res
      .status(401)
      .json({ loggedIn: false, message: "No token provided" });
  }

  const token = tokenHeader.split(" ")[1];
  console.log("Received Token:", tokenHeader);

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      console.error("Error verifying token:", err);

      return res
        .status(403)
        .json({ loggedIn: false, message: "Failed to authenticate token" });
    }

    console.log("Decoded Token:", decoded);

    res.status(200).json({ loggedIn: true, userId: decoded.id });
  });
});

// hanldes the user data request
// query the user from the database
// send the user data to the user
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

// hanldes the all user data request
// query all users from the database
// send all users data to the user
app.get("/AlluserData", async (req, res) => {
  try {
    await client.connect();
    console.log("Connected to database");

    const database = client.db("webTechnologyCourse");
    const collection = database.collection("users");

    const userData = await collection.find({}).toArray();

    const users = userData.map((userDoc) => ({
      _id: userDoc._id,
      userName: userDoc.userName,
      password: userDoc.password,
      balance: userDoc.balance,
      coins: userDoc.coins,
    }));

    res
      .status(200)
      .json({ success: true, message: "user Data Found", users: users });
  } catch (err) {
    console.error("Error fetching All users Data:", err);
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
