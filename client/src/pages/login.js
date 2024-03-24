import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authenticateUser } from '../routes/script.js';

// here is the login ui react component
// any functionality for the login page will be written here
/**
 * Login component for user authentication.
 *
 * @returns {JSX.Element} The rendered Login component.
 */
const Login = () => {
  const [userName, setUserName] = useState(""); // Use state hook to manage input value
  const [password, setPassword] = useState("");
  const [loginMessage, setMessage] = useState("");
  const navigate = useNavigate(); // navigte to home

  const signIn = async (event) => {
    event.preventDefault();
    let token = null;

    try {
      const response = await authenticateUser(userName, password);
      if (response.success === false) {
        setMessage(response.message);
        console.log(response.message);
      }
      else // a session created on the server side so now this user is recignize via the session he got from server
      {
        console.log(response);
        token = response.token;  // take the toekn for the user this token will be avail for 10m
        console.log(token);
        localStorage.setItem('authToken', token); //save this token on the local storage
        localStorage.setItem('userName', userName); //save this token on the local storage
        console.log(response.balance);
        if(response.balance===null)
        {
          localStorage.setItem('balance', 0);
        }
        else
        {
          localStorage.setItem('balance', parseFloat(response.balance));
        }
        navigate('/');
        window.location.reload();
      }
    } catch (error) {
      console.error('Error during authentication:', error);
    }
  };

  return (
    <div id="logInTitle" className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 mx-auto max-w-md overflow-y-hidden">
      <h1 className="my-4 text-3xl md:text-5xl text-white opacity-75 font-bold leading-tight text-center md:text-left">
        Already
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-pink-500 to-purple-500">
          User?
        </span>
        Login
      </h1>

      {/* Login Form */}
      <form id="loginForm" onSubmit={signIn} className="bg-gray-900 opacity-75 w-full shadow-lg rounded-lg px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          {/* User Name */}
          <input
            className="shadow appearance-none border rounded w-full p-3 text-gray-700 leading-tight focus:ring transform transition hover:scale-105 duration-300 ease-in-out"
            type="text"
            placeholder="User Name"
            defaultValue={userName} // Use defaultValue instead of value
            onChange={(e) => setUserName(e.target.value)} // Set the state on change
          />
        </div>
        {/* Password1 */}
        <div className="mb-4">
          <input
            className="shadow appearance-none border rounded w-full p-3 text-gray-700 leading-tight focus:ring transform transition hover:scale-105 duration-300 ease-in-out"
            type="password"
            placeholder="Password"
            defaultValue={password} // Use defaultValue instead of value
            onChange={(e) => setPassword(e.target.value)} // Set the state on change
          />
        </div>
        {/* Login Button */}
        <div className="flex items-center justify-between pt-4">
          <input
            id="loginBtn"
            className="bg-gradient-to-r from-purple-800 to-green-500 hover:from-pink-500 hover:to-green-500 text-white font-bold py-2 px-4 rounded focus:ring transform transition hover:scale-105 duration-300 ease-in-out"
            type="submit"
            value="Login"
          />
          <div className="messageContainer">{loginMessage}</div>
        </div>
      </form>
    </div>
  );
};

export default Login; // Don't forget to export the component
