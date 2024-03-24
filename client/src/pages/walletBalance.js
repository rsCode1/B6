import React, { useState, useEffect } from "react";
import axios from "axios";
import { getUserWallet } from "../routes/script.js";
import { depositFunds } from "../routes/script.js";

// pages/walletBalance.js

function CreateUserWalletTable() {
  const [wallet, setWallet] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserWallet = async () => {
      try {
        const userName = localStorage.getItem("userName");
        const response = await getUserWallet(userName);
        if (response && response.userCoins) {
          setWallet(response.userCoins);
          await fetchCoinPrices(response.userCoins);
        } else {
          // handle no coins case
        }
      } catch (error) {
        console.error("Error fetching user wallet:", error);
      }
      setIsLoading(false);
    };

    fetchUserWallet();
  }, []);

  const fetchCoinPrices = async (userCoins) => {
    const coinIDs = userCoins
      .map((coin) => coin.coinName.toLowerCase())
      .join(",");

    try {
      const response = await axios.get(
        `https://api.coingecko.com/api/v3/coins/markets`,
        {
          params: {
            vs_currency: "usd",
            ids: coinIDs,
            order: "market_cap_desc",
            per_page: userCoins.length,
            page: 1,
            sparkline: false,
          },
        }
      );

      // Create a map for quick access
      const coinDataMap = response.data.reduce((map, coin) => {
        map[coin.id] = coin;
        return map;
      }, {});

      // Map the API data back to the wallet state
      const updatedWallet = userCoins.map((coin) => {
        const liveData = coinDataMap[coin.coinName.toLowerCase()] || {};
        return {
          ...coin,
          symbol: liveData.symbol.toUpperCase(), // Get the symbol from the response
          price: liveData.current_price || "N/A",
          value: liveData.current_price
            ? (coin.amount * liveData.current_price).toFixed(2)
            : "N/A",
          change: liveData.price_change_percentage_24h
            ? liveData.price_change_percentage_24h.toFixed(2)
            : "N/A",
        };
      });

      setWallet(updatedWallet);
    } catch (error) {
      console.error("Error fetching coin prices and symbols:", error);
      // Handle the error appropriately
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <table className="table-auto">
      <thead>
        <tr>
          <th className="px-4 py-2">Currency</th>
          <th className="px-4 py-2">Symbol</th>
          <th className="px-4 py-2">Amount</th>
          <th className="px-4 py-2">Price (USD)</th>
          <th className="px-4 py-2">Value (USD)</th>
          <th className="px-4 py-2">Change (24h%)</th>
        </tr>
      </thead>
      <tbody>
        {wallet.map((coin, index) => (
          <tr key={index}>
            <td className="border px-4 py-2">{coin.coinName}</td>
            <td className="border px-4 py-2">
              {coin.symbol ? coin.symbol.toUpperCase() : ""}
            </td>
            <td className="border px-4 py-2">{coin.amount}</td>
            <td className="border px-4 py-2">{coin.price}</td>
            <td className="border px-4 py-2">{coin.value}</td>
            <td className="border px-4 py-2">{coin.change}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const DepositFundsButton = () => {
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleDeposit = async (e) => {
    e.preventDefault();
    const userName = localStorage.getItem("userName");
    const response = await depositFunds(userName, amount);
    if (response.success) {
      // Assuming 'response.newBalance' contains the updated balance
      localStorage.setItem("balance", response.balance);
      window.dispatchEvent(new Event("storage")); // This line will trigger the storage event listener
    }
    setMessage(response.message);
    setIsSuccess(response.success);
  };

  return (
    <div
      style={{
        textAlign: "center",
        color: "white",
        padding: "20px",
      }}
    >
      <form onSubmit={handleDeposit}>
        <input
          type="number"
          placeholder="Enter amount to deposit"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={{
            marginBottom: "10px",
            padding: "10px",
            color: "black",
            width: "33%",
          }}
        />
        <br />
        <button
          type="submit"
          style={{
            backgroundColor: "green",
            color: "white",
            padding: "5px 10px",
            borderRadius: "5px",
          }}
        >
          Deposit
        </button>
      </form>
      <div
        className={isSuccess ? "success" : "error"}
        style={{ marginTop: "10px" }}
      >
        {message}
      </div>
    </div>
  );
};

const WalletBalance = () => {
  return (
    <div>
      <DepositFundsButton />
      <CreateUserWalletTable />
    </div>
  );
};

export default WalletBalance;
