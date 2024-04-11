import React, { useState, useEffect } from "react";
import "tailwindcss/tailwind.css";
import { BrowserRouter as Router, Link, Route, Routes } from "react-router-dom";
import Login from "./pages/login.js";
import SignUp from "./pages/signUp.js";
import Leaderboard from "./pages/leaderboard.js";
import Learning from "./pages/learning.js";
import MarketTable from "./pages/marketTable.js";
import WalletBalance from "./pages/walletBalance.js";
import Home from "./pages/home.js";
import Logout from "./pages/logOut.js";
import { checkActiveToken } from "./routes/script.js";

/**
 * Renders the Navbar component.
 * The Navbar component displays a navigation bar with links based on the user's authentication status.
 * It also retrieves and displays the user's balance from local storage.
 * @returns {JSX.Element} The rendered Navbar component.
 */
function Navbar() {
  console.log("Navbar component rendered");
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [myBalance, setMyBalance] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  let userName = "";

  useEffect(() => {
    const fetchUserStatus = async () => {
      const loggedIn = await checkActiveToken();
      setUserLoggedIn(loggedIn);
      console.log(loggedIn);
    };
    fetchUserStatus();
  }, [userLoggedIn]);

  useEffect(() => {
    // Function to handle the storage event
    const handleStorageChange = () => {
      const storedBalance = localStorage.getItem("balance");
      if (storedBalance !== null) {
        setMyBalance(parseFloat(storedBalance).toFixed(2));
      }
    };

    // Add event listener for storage change
    window.addEventListener("storage", handleStorageChange);

    // Initial balance update
    handleStorageChange();

    // Cleanup: remove event listener
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []); // Empty dependency array to run the effect only once
  if (userLoggedIn) {
    userName = localStorage.getItem("userName");
  }

  return (
    <Router>
      <div>
        {/* Navbar */}
        <nav className="bg-blue-gray-800 opacity-75 shadow-lg text-white w-full">
          <div className="flex justify-between items-center px-4 py-2">
            <div>
              <button
                className="text-white focus:outline-none md:hidden"
                onClick={() => setIsOpen(!isOpen)}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {isOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
            {/* Items that will be hidden on mobile */}
            <div
              className={`md:flex ${
                isOpen ? "block" : "hidden"
              } md:items-center w-full md:w-auto`}
              id="menu"
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-center w-full">
                <div className="flex flex-col md:flex-row md:items-center">
                  {userLoggedIn === false ? (
                    <>
                      <Link
                        to="/login"
                        onClick={() => setIsOpen(false)}
                        className="nav-link py-2 md:py-0"
                      >
                        Login
                      </Link>
                      <Link
                        to="/signUp"
                        onClick={() => setIsOpen(false)}
                        className="nav-link py-2 md:py-0 ml-4"
                      >
                        Sign Up
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/logout"
                        onClick={() => setIsOpen(false)}
                        className="nav-link py-2 md:py-0 ml-4"
                      >
                        Logout
                      </Link>
                      <div
                        className="ml-20 py-2 md:py-0"
                        style={{ color: "white", fontWeight: "bold" }}
                      >
                        Balance:{" "}
                        <span
                          className={`nav-link ${
                            myBalance < 0 ? "text-red-500" : "text-green-500"
                          }`}
                        >
                          {myBalance}$
                        </span>
                      </div>
                      <div className="ml-1 py-2 md:py-0">
                        <span style={{ fontWeight: "bold" }}>Hi,</span>
                        <span
                          className="nav-link"
                          style={{ color: "lightblue" }}
                        >
                          {" "}
                          {userName}
                        </span>
                      </div>
                    </>
                  )}
                </div>
                <div className="flex flex-col md:flex-row md:items-center mt-4 md:mt-0">
                  <Link
                    to="/"
                    onClick={() => setIsOpen(false)}
                    className="nav-link py-2 md:py-0"
                  >
                    Home
                  </Link>
                  <Link
                    to="/leaderboard"
                    onClick={() => setIsOpen(false)}
                    className={`nav-link py-2 md:py-0 ml-4 ${
                      userLoggedIn ? "" : "disabled-link"
                    }`}
                  >
                    Leaderboard
                  </Link>
                  <Link
                    to="/learning"
                    onClick={() => setIsOpen(false)}
                    className={`nav-link py-2 md:py-0 ml-4 ${
                      userLoggedIn ? "" : "disabled-link"
                    }`}
                  >
                    Learning
                  </Link>
                  <Link
                    to="/markettable"
                    onClick={() => setIsOpen(false)}
                    className={`nav-link py-2 md:py-0 ml-4 ${
                      userLoggedIn ? "" : "disabled-link"
                    }`}
                  >
                    Market Table
                  </Link>
                  <Link
                    to="/walletbalance"
                    onClick={() => setIsOpen(false)}
                    className={`nav-link py-2 md:py-0 ml-4 ${
                      userLoggedIn ? "" : "disabled-link"
                    }`}
                  >
                    Wallet Balance
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signUp" element={<SignUp />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/learning" element={<Learning />} />
          <Route path="/markettable" element={<MarketTable />} />
          <Route path="/walletbalance" element={<WalletBalance />} />
        </Routes>
      </div>
    </Router>
  );
}

/**
 * Renders the footer component.
 * @returns {JSX.Element} The rendered footer component.
 */
function Footer() {
  return (
    <div className=" footer fixed bottom-0 left-0 w-full p-4 text-sm text-left fade-in">
      <div>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
          id="logoutButton"
          hidden
        >
          Log Out
        </button>
      </div>
      {/* Copyright Information */}
      <a
        className="text-gray-500 no-underline hover:no-underline"
        href="OUR GIT HUB"
      >
        &copy; App 2024
      </a>
      - Project by
      {/* Contributors' Links */}
      <a
        className="text-gray-500 no-underline hover:no-underline"
        href="https://github.com/AxFISR"
      >
        Alex,
      </a>
      <a
        className="text-gray-500 no-underline hover:no-underline"
        href="https://github.com/rsCode1"
      >
        Roi,
      </a>
      <a
        className="text-gray-500 no-underline hover:no-underline"
        href="https://github.com/"
      >
        Shimron,
      </a>
      <a
        className="text-gray-500 no-underline hover:no-underline"
        href="https://github.com/"
      >
        Daniel
      </a>
    </div>
  );
}

/**
 * Renders the main App component.
 *
 * @returns {JSX.Element} The rendered App component.
 */
function App() {
  return (
    <div>
      <Navbar />
      <Footer />
    </div>
  );
}

export default App;
