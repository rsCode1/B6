// Import necessary libraries and modules
import React, { useState, useEffect } from "react";
import crypto_trade_image from "../images/crypto_trade.jpg";

/**
 * Creates a table displaying cryptocurrency data fetched from the Coingecko API.
 * @returns {JSX.Element} The JSX element representing the cryptocurrency data table.
 */
function CreateCryptoDataTable() {
  const [fetchData, setFetchData] = useState(null);

  useEffect(() => {
    fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=30&page=1&sparkline=false&x_cg_demo_api_key"
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetch Data:", data);
        setFetchData(data);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <div className="container mx-auto mt-0">
      <h3 className="text-lg md:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-pink-500 to-purple-500">
        Coin value
      </h3>
      {fetchData ? (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr>
                {/* Adjust column headings for responsiveness */}
                <th className="py-2 px-2 md:px-4 border-b">Number</th>
                <th className="py-2 px-2 md:px-4 border-b">Coin</th>
                <th className="py-2 px-2 md:px-4 border-b">Symbol</th>
                <th className="py-2 px-2 md:px-4 border-b">Price (USD)</th>
                <th className="py-2 px-2 md:px-4 border-b">Change (24h %)</th>
                <th className="py-2 px-2 md:px-4 border-b">High (24h)</th>
                <th className="py-2 px-2 md:px-4 border-b">Low (24h)</th>
              </tr>
            </thead>
            <tbody>
              {fetchData.map(
                (coinData, index) =>
                  index < 5 && (
                    <tr key={index}>
                      {/* Adjust cell padding for responsiveness */}
                      <td className="py-2 px-2 md:px-4 border-b">
                        {index + 1}
                      </td>
                      <td className="py-2 px-2 md:px-4 border-b">
                        {coinData.name}
                      </td>
                      <td className="py-2 px-2 md:px-4 border-b">
                        {coinData.symbol.toUpperCase()}
                      </td>
                      <td className="py-2 px-2 md:px-4 border-b">
                        {coinData.current_price}
                      </td>
                      <td className="py-2 px-2 md:px-4 border-b">
                        {coinData.price_change_percentage_24h}
                      </td>
                      <td className="py-2 px-2 md:px-4 border-b">
                        {coinData.high_24h}
                      </td>
                      <td className="py-2 px-2 md:px-4 border-b">
                        {coinData.low_24h}
                      </td>
                    </tr>
                  )
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

function Home() {
  return (
    <div className="h-full flex flex-col items-center justify-center mt-8 px-4 sm:px-6 lg:px-8">
      <div className="w-full container mx-auto text-center mb-8">
        {/* Title of the Application */}
        <p className="flex items-center justify-center text-indigo-400 no-underline hover:no-underline font-bold text-xl sm:text-2xl md:text-3xl lg:text-4xl">
          <span className="leading-tight">
            Cryptocurrency
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-pink-500 to-purple-500">
              Exchange Simulator
            </span>
          </span>
        </p>
        <p className="text-sm sm:text-base leading-normal text-blue-300 mb-4">
          Simulation platform for
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-green-400 to-pink-500">
            {" "}
            cryptocurrency trading
          </span>
        </p>
        <p className="text-sm sm:text-base leading-normal text-blue-300 mb-4">
          Dive into Real-Time Market
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-green-400 to-pink-500">
            {" "}
            Dynamics
          </span>
        </p>
      </div>
      <div>
        <CreateCryptoDataTable />
      </div>
      <div className="mt-8">
        <p className="flex items-center justify-center text-indigo-400 no-underline hover:no-underline font-bold text-xl sm:text-2xl md:text-3xl lg:text-4xl mb-4">
          <span className="leading-tight">
            <span className="text-white">Unlock the world of</span>{" "}
            Cryptocurrency
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-pink-500 to-purple-500">
              {" "}
              Exchange Simulator
            </span>
          </span>
        </p>
      </div>
      <div>
        <img
          src={crypto_trade_image}
          alt="Crypto Trade"
          className="w-56 sm:w-72 md:w-96 h-auto"
        />
      </div>
    </div>
  );
}

// Export the Home component
export default Home;
