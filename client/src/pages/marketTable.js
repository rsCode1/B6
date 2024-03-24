// pages/walletBalance.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkActiveToken } from '../routes/script.js';
import { purchase } from '../routes/script.js';
import { getUserData } from '../routes/script.js';
import { updateUserSell } from '../routes/script.js';


function CreateCryptoDataTable() 
{
  const navigate = useNavigate(); // navigte to login if user is not logged in
  const [fetchData, setFetchData] = useState(null);
  // State variable to store the buy amount
  const [buyAmounts, setBuyAmounts] = useState(Array(30).fill(0));
  const [sellAmounts, setSellAmounts] = useState(Array(30).fill(0));

  useEffect(() => {
    const fetchDataAndCheckUserLogin = async () => {
      try {
        const userIsLoggedIn = await checkActiveToken();
        if (!userIsLoggedIn) {
          console.log("Navigating to logout");
          navigate('/logOut');
          return; // Exit the function if user is not logged in
        }
  
        const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=30&page=1&sparkline=false&x_cg_demo_api_key');
        const data = await response.json();
        console.log('Fetch Data:', data);
        setFetchData(data);
        // Initialize buyAmounts array with 0 for each row
        setBuyAmounts(Array(data.length).fill(0));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchDataAndCheckUserLogin();
  }, [navigate]);
  
  // this funciton update the array of buyAmount each time the user wrtie new amount value i the input box
  const handleInputBuyChange = (index, amount) => {
    const newBuyAmounts = [...buyAmounts]; // take the array of buyAmount variables
    newBuyAmounts[index] = amount; // get the correct buyAmount value using the index (if we pressed the index=1 button we get the buyAmount corrisponed to that button)
    setBuyAmounts(newBuyAmounts); // use the hook function and changed the new buyAmount the user inserted
  };

  const handleInputSellChange = (index, amount) => {
    const newSellAmounts = [...sellAmounts]; // take the array of buyAmount variables
    newSellAmounts[index] = amount; // get the correct buyAmount value using the index (if we pressed the index=1 button we get the buyAmount corrisponed to that button)
    setSellAmounts(newSellAmounts); // use the hook function and changed the new buyAmount the user inserted
  };

  // this function handle the buy action 
  const handleBuy  = async (index, coinData, buyAmounts) => {
    const balanceString = localStorage.getItem("balance");
    const userBalance = balanceString !== null ? parseFloat(balanceString).toFixed(2) : 0;
    const current_price = parseFloat(coinData.current_price); // take the price of the coin
    const arrayOfBuyAmountCoins = [...buyAmounts];
    const BuyAmountCoin = arrayOfBuyAmountCoins[index]; // take the correct data of user from the correct coin
    const payment = current_price * BuyAmountCoin; // number of coins * amount of coin = payment
    console.log("userBalnce: " + userBalance);
    console.log("user buyAmount: " + BuyAmountCoin);
    console.log("user payment: " + payment);
    if (BuyAmountCoin <= 0 || isNaN(BuyAmountCoin)) {
      window.alert("invalid coin amount.");
    } else if (!isNaN(userBalance) && userBalance < payment) {
      window.alert(
        "Insufficient balance\n" +
          "total payment: " +payment +"$" +
          "\nbalance: " +userBalance +"$"
      );
    } 
    else 
    {
      const confirmation = window.confirm(
        "Do you want to proceed with the purchase?\n\n" +
          "Coin: " + coinData.name + "\n" +
          "Amount: " + BuyAmountCoin + "\n" +
          "Your balance: " + userBalance + "$\n" +
          "Total payment: " + payment + "$\n" +
          "Balance after purchase: " + (parseFloat(userBalance - payment).toFixed(2)) + "$"
      );
      
      if (confirmation) 
      {
        console.log("user confirmed purchase");
        const userName = localStorage.getItem("userName"); // get the user name
    
        try {
            const response = await purchase(userName, BuyAmountCoin, coinData.name, payment);
            
            // Check if the purchase was successful based on the response
            if (response.success) {
                // Purchase was successful
                const newBalance = parseFloat(response.balance).toFixed(2); // take two numbers after the zero
                console.log("Purchase successful:", response.message);
                window.alert(response.message + "\nNew balance: " + newBalance +"$");
                localStorage.setItem('balance', newBalance); // update the balance in the local storage
                window.dispatchEvent(new Event('storage')); // triger the function to update the balance in the navbar using the listen i added to local storage  
            } else {
                // Purchase was not successful
                console.error("Purchase failed:", response.message);
                window.alert("Purchase failed: " + response.message);
                // Perform any additional error handling
            }
        } catch (error) {
            // Handle the error from the purchase function
            console.error("Error during purchase:", error.message);
            window.alert("Error during purchase: " + error.message);
            // Perform any additional error handling
        }
    }
  }
    handleInputBuyChange(index,0);
  };
  // HADNLE THE SELL ACTION
  const handleSell = async (index,coinData,sellAmounts) =>
  {
    try 
    {
      const sellAmount = parseFloat([...sellAmounts][index]);
      const coinPrice = parseFloat(coinData.current_price);
      if (sellAmount <= 0 || isNaN(sellAmount))  // first check if user sell amount is valid
      {
        window.alert("invalid coin amount.");
        handleInputSellChange(index,0);
        return;
      }
      const moneyToEarn = coinPrice*sellAmount; // calculate money to eran 
      const userName = localStorage.getItem("userName"); // the user name
      const response = await getUserData(userName); // fetach the data of the user name
      if (!response.success) 
      {
        throw new Error(response.message); // Throw an error with the message from the response
      }
      const userData= response.userData // extract the data form the response
      const userBalance= userData.balance; // get the balance of the user name
      console.log("recived user data ",userData);
      let userAmountCoin = 0; 
      //check if the user have enough coin to sell
      const foundCoin = userData.coins.find(coin => coin.coinName === coinData.name); // search for the coin
      if (foundCoin) // if we found the coin we get the amount of coin else the amount will be just zero
      {
          userAmountCoin = parseFloat(foundCoin.amount);
      }
      if(sellAmount>userAmountCoin)
      {
        window.alert("Insufficient coins for sale\n\n" +
        "Available coins in wallet: " + userAmountCoin + ".\n" +
        "Requested coins to sell: " + sellAmount + ".");
      }
      else 
      {
        const newCoinsInWallet = userAmountCoin - sellAmount;
        const newBalance = userBalance + moneyToEarn;
        const confirmationMessage =
          "Do you want to proceed with the sell?\n\n" +
          "Coin: " + coinData.name + "\n" +
          "Selling amount: " + sellAmount + "\n" +
          "Coins in wallet: " + userAmountCoin + "\n" +
          "Coins in wallet after selling: " + newCoinsInWallet + "\n" +
          "Earned money: " + moneyToEarn.toFixed(2) + "$\n" +
          "Balance after selling: " + newBalance.toFixed(2) + "$";

        const confirmation = window.confirm(confirmationMessage);
        if (confirmation) 
        {
            const sellResponse = await updateUserSell(userName,coinData.name,newCoinsInWallet,newBalance);
            if(!sellResponse.success)
            {
              throw new Error(sellResponse.message);
            }
            console.log("response of sell action : ",sellResponse)
            localStorage.setItem('balance', parseFloat(sellResponse.balance).toFixed(2)); // update the balance in the local storage
            window.dispatchEvent(new Event('storage')); // triger the function to update the balance in the navbar using the listen i added to local storage 
            window.alert(sellResponse.message)
        }
      }
    }
    catch (error) 
    {
      console.error('Error:', error);
      window.alert(error);
    }
    handleInputSellChange(index,0);
  }
  

  return (
    <div className="container mx-auto mt-0 pb-20">
      <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-pink-500 to-purple-500">Market Table</h3>
      {fetchData ? (
        <table className="table">
          <thead>
            <tr>
              {/* create all the columns */}
              <th className="py-2 px-4 border-b">Number</th>
              <th className="py-2 px-4 border-b">Coin</th>
              <th className="py-2 px-4 border-b">Symbol</th>
              <th className="py-2 px-4 border-b">Price (USD)</th>
              <th className="py-2 px-4 border-b">Change (24h %)</th>
              <th className="py-2 px-4 border-b">High (24h)</th>
              <th className="py-2 px-4 border-b">Low (24h)</th>
              <th className="py-2 px-4 border-b">Trade</th>
            </tr>
          </thead>
          <tbody>
          {fetchData.map((coinData, index) =>(
              <tr key={index}>
                <td className="py-2 px-4 border-b">{index + 1}</td>
                <td className="py-2 px-4 border-b">{coinData.name}</td>
                <td className="py-2 px-4 border-b">{coinData.symbol.toUpperCase()}</td>
                <td className="py-2 px-4 border-b">{coinData.current_price}</td>
                <td className="py-2 px-4 border-b">{coinData.price_change_percentage_24h}</td>
                <td className="py-2 px-4 border-b">{coinData.high_24h}</td>
                <td className="py-2 px-4 border-b">{coinData.low_24h}</td>
                <td className="py-2 px-4 border-b">
                  <div className="flex items-center">
                    <input type="number" className = "number-input" id={`buy-input-${index + 1}`} value={buyAmounts[index]} onChange={(e) => handleInputBuyChange(index, e.target.value)} />
                    <button className="buy-button ml-2" id={`buy-${index + 1}`} onClick={() => handleBuy(index, coinData, buyAmounts)}>Buy</button>
                    <div className="flex items-center"> 
                      <input type="number" className = "number-input  ml-4" id={`sell-input-${index + 1}`} value={sellAmounts[index]} onChange={(e) => handleInputSellChange(index, e.target.value)} />
                      <button className="sell-button ml-2" id={`sell-${index + 1}`} onClick={() => handleSell(index, coinData, sellAmounts)}>Sell</button>
                    </div>
                  </div>
                </td>            
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}


const MarketTable = () => {
  return (
    <div>
      <CreateCryptoDataTable/>
    </div>
  );
};

export default MarketTable;
