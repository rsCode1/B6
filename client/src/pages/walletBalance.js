import React, { useState, useEffect } from "react";
import { getUserWallet } from "../routes/script.js";

// pages/walletBalance.js

function CreateUserWalletTable() {
  const [wallet, setWallet] = useState([]);

  useEffect(() => {
    const fetchUserWallet = async () => {
      const userName = localStorage.getItem("userName");
      const response = await getUserWallet(userName);
      console.log(response.userCoins);
      setWallet(response.userCoins);
    };
    fetchUserWallet();
  }, []);

  return (
    <table className="table-auto">
      <thead>
        <tr>
          <th className="px-4 py-2">Currency</th>
          <th className="px-4 py-2">Amount</th>
        </tr>
      </thead>
      <tbody>
        {wallet.map((coin, index) => (
          <tr key={index}>
            <td className="border px-4 py-2">{coin.coinName}</td>
            <td className="border px-4 py-2">{coin.amount}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const WalletBalance = () => {
  return (
    <div>
      <CreateUserWalletTable />
    </div>
  );
};

export default WalletBalance;
