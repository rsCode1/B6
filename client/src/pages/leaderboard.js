// pages/leaderboard.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkActiveToken } from '../routes/script.js';
import { getAllUserData } from '../routes/script.js';
import { sortUsersByBalance } from '../JS/utils.js';

const Leaderboard = () => {
  const navigate = useNavigate(); // navigte to login if user is not logged in
  const [fetchData, setFetchData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDataAndCheckUserLogin = async () => {
      try {
        const userIsLoggedIn = await checkActiveToken();
        if (!userIsLoggedIn) {
          console.log("Navigating to logout");
          navigate('/logOut');
          return; // Exit the function if user is not logged in
        }
  
        const userName = localStorage.getItem("userName"); // the user name
        const response = await getAllUserData(userName); // fetach the data of the user name
        if (!response.success) 
        {
          throw new Error(response.message); // Throw an error with the message from the response
        }
        console.log('from leaderBorad Fetch response:', response);
        setFetchData(sortUsersByBalance(response.users)); // sort the users according  
        setLoading(false); // Set loading to false after data fetching is complete
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchDataAndCheckUserLogin();
  }, [navigate]);

  return (
      <div id="leaderboard">
        <div className="ribbon"><span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-pink-500 to-purple-500">#Leaderboard</span></div>
        <table className="leaderboard-table" style={{ marginBottom: '100px' }}>
          <thead>
            <tr>
              <th className="number">#</th>
              <th className="name">Name</th>
              <th className="balance">profit</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="3">Loading...</td>
              </tr>
            ) : (
              fetchData.map((user, index) => (
                <tr key={index}>
                  <td className="number">{index + 1}</td>
                  <td className="name">{user.userName}</td>
                  <td className="balance">{user.balance.toFixed(2)}$</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
  );
};

export default Leaderboard;
