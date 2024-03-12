import React, { useState, useEffect } from 'react';
import 'tailwindcss/tailwind.css';
import { BrowserRouter as Router, Link, Route, Routes } from 'react-router-dom';
import Login from './pages/login.js';
import SignUp from './pages/signUp.js';
import Leaderboard from './pages/leaderboard.js';
import Learning from './pages/learning.js';
import MarketTable from './pages/marketTable.js';
import WalletBalance from './pages/walletBalance.js';
import Home from './pages/home.js';
import Logout from './pages/logOut.js'
import { checkActiveToken } from './routes/script.js';

function Navbar() {
  console.log('Navbar component rendered');
  const [userLoggedIn, setUserLoggedIn] = useState(false);
 

  useEffect(() => {
    const fetchUserStatus = async () => {
      const loggedIn = await checkActiveToken();
      setUserLoggedIn(loggedIn);
      console.log(loggedIn);
    };
    fetchUserStatus();
  }, []);
  return (
    <Router>
      <div>
        {/* Navbar */}
        <nav className="bg-blue-gray-800 opacity-75 w-full shadow-lg text-center overflow-hidden">
          <div className="flex justify-between items-center py-2">
            <div className="flex items-center">
              {/* Conditionally render Login, SignUp, or Logout based on authentication status */}
              {userLoggedIn === false ? (
                <>
                  <Link to="/login" className="nav-link">
                    Login
                  </Link>
                  <Link to="/signUp" className="nav-link ml-4">
                    Sign Up
                  </Link>
                </>
              ) : (
                <Link to="/logout" className="nav-link ml-4">
                  Logout
                </Link>
              )}
            </div>
            <div className="flex items-center">
              {/* Conditionally render other links based on authentication status */}
              {userLoggedIn === false ? (
                <>
                  <Link to="/" className="nav-link">
                    Home
                  </Link>
                  <Link to="/leaderboard" className="nav-link ml-4 disabled-link">
                    Leaderboard
                  </Link>
                  <Link to="/learning" className="nav-link ml-4 disabled-link">
                    Learning
                  </Link>
                  <Link to="/markettable" className="nav-link ml-4 disabled-link">
                    Market Table
                  </Link>
                  <Link to="/walletbalance" className="nav-link ml-4 disabled-link">
                    Wallet Balance
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/" className="nav-link">
                    Home
                  </Link>
                  <Link to="/leaderboard" className="nav-link ml-4">
                    Leaderboard
                  </Link>
                  <Link to="/learning" className="nav-link ml-4">
                    Learning
                  </Link>
                  <Link to="/markettable" className="nav-link ml-4">
                    Market Table
                  </Link>
                  <Link to="/walletbalance" className="nav-link ml-4">
                    Wallet Balance
                  </Link>
                </>
              )}
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



function Footer() {
  return (
    <div className=" footer fixed bottom-0 left-0 w-full p-4 text-sm text-left fade-in">
      <div>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full" id="logoutButton" hidden>
          Log Out
        </button>
      </div>
      {/* Copyright Information */}
      <a className="text-gray-500 no-underline hover:no-underline" href="OUR GIT HUB">
        &copy; App 2024
      </a>
      - Project by
      {/* Contributors' Links */}
      <a className="text-gray-500 no-underline hover:no-underline" href="https://github.com/AxFISR">
        Alex,
      </a>
      <a className="text-gray-500 no-underline hover:no-underline" href="https://github.com/">
        Roi,
      </a>
      <a className="text-gray-500 no-underline hover:no-underline" href="https://github.com/">
        Shimron,
      </a>
      <a className="text-gray-500 no-underline hover:no-underline" href="https://github.com/">
        Daniel
      </a>
    </div>
  );
}

function App() {
  return (
    <div>
      <Navbar/>
      <Footer />
    </div>
  );
}

export default App;
