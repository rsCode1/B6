import { MongoClient } from 'mongodb';


const uri = "mongodb+srv://cryptoAdmin:admin@webtechnologycourse.hm9v4is.mongodb.net/";
const client = new MongoClient(uri);

async function connectToDatabase() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}

// Function to handle 'Buy' button click event
async function handleBuyButtonClick(CoinName, amount, priceUSD) {
    //const uri = "mongodb+srv://cryptoAdmin:admin@webtechnologycourse.hm9v4is.mongodb.net/";
    const userLogged = "John202";

    try {
        // MongoDB client instance
        //const client = new MongoClient(uri);
        
        // Connect to MongoDB Atlas
        //await client.connect();
        
        
        const db = client.db("webTechnologyCourse");
        const col = db.collection("users");

        // Find user by userName
        const filter = { userName: userLogged };
        const user = await col.findOne(filter);

        if (user) {
            // Calculate the total cost
            const totalCost = amount * priceUSD;

            // Check if user has enough balance
            if (user.balance >= totalCost) {
                // Update balance and add purchased coin to user's coins array
                const updatedBalance = user.balance - totalCost;

                // Update user's balance in the database
                await col.updateOne(filter, { $set: { balance: updatedBalance } });

                // Check if the coin already exists in the coins array
                const existingCoinIndex = user.coins.findIndex(coin => coin.coinName === CoinName);
                if (existingCoinIndex !== -1) {
                    // If the coin exists, update the amount
                    user.coins[existingCoinIndex].amount += amount;
                } else {
                    // If the coin doesn't exist, add it to the coins array
                    user.coins.push({ coinName: CoinName, amount: amount });
                }

                // Update user's coins array in the database
                await col.updateOne(filter, { $set: { coins: user.coins } });

                console.log("Purchase successful!");
                return { success: true };
            } else {
                console.log("Insufficient balance!");
                return { success: false, error: "Insufficient balance" };
            }
        } else {
            console.log("User not found!");
            return { success: false, error: "User not found" };
        }
    } catch (err) {
        console.log(err.stack);
        return { success: false, error: err.message };
    } finally {
        await client.close();
    }
}


export { client, connectToDatabase };