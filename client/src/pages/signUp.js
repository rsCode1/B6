import React, { useState } from 'react';
import { userNameAvailable } from '../routes/script.js';
import { register } from '../routes/script.js';
import { useNavigate } from 'react-router-dom';

/**
 * Renders the SignUp component.
 * checks if the username is available and if the passwords match
 * 
 * @returns {JSX.Element} The SignUp component.
 */
function SignUp() {
  const [userName, setUserName] = useState(""); 
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [signUpMessage, setMessage] = useState("");
  const navigate = useNavigate(); // navigte to home
  const OnSignUp = async (event) => {
    
    event.preventDefault(); 
    let okToSignUp = true; 

    try 
    {
      const response = await userNameAvailable(userName); 
      let msg=""
      if (response === false) {
        msg = "Username already taken.\n"; // If the username is not available,
        okToSignUp = false; 
        
      }
      else if (password1 !== password2) {
        msg = "Passwords do not match.\n"; // If passwords don't match, append message
        okToSignUp = false; 
      }

      
      setMessage(msg);
    
      if (okToSignUp) 
      {
        const response = await register(userName, password1);
        console.log(response);
  
        if (response.registerStatus === true) 
        {
          alert('You have successfully registered. Welcome to the Cryptocurrency market trade!');
          navigate("/");
        } else {
          setMessage(response.message);
        }
      }
    }
    catch (err) 
    {
      console.log("error signUp : " + err);
      setMessage(err);
    }

  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="my-4 text-3xl md:text-5xl text-white opacity-75 font-bold leading-tight text-center md:text-left">
        Learn
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-pink-500 to-purple-500">
          To Trade
        </span>
        Like Pro
      </h1>
      <form id="signupForm" onSubmit={OnSignUp} className="bg-gray-900 opacity-75 w-full max-w-md shadow-lg rounded-lg px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label className="block text-blue-300 py-2 font-bold mb-2">
            Sign up and start trading
          </label>
          {/* User Name */}
          <input
            className="shadow appearance-none border rounded w-full p-3 text-gray-700 leading-tight focus:ring transform transition hover:scale-105 duration-300 ease-in-out"
            id="userName2"
            type="text"
            placeholder="User Name"
            defaultValue={userName} 
            onChange={(e) => setUserName(e.target.value)} 
          />
        </div>
        {/* Password1 */}
        <div className="mb-4">
          <input
            className="shadow appearance-none border rounded w-full p-3 text-gray-700 leading-tight focus:ring transform transition hover:scale-105 duration-300 ease-in-out"
            id="password2"
            type="text"
            placeholder="Password"
            defaultValue={password1} 
            onChange={(e) => setPassword1(e.target.value)} 
          />
        </div>
        {/* Password2 */}
        <div>
          <input
            className="shadow appearance-none border rounded w-full p-3 text-gray-700 leading-tight focus:ring transform transition hover:scale-105 duration-300 ease-in-out"
            id="password3"
            type="text"
            placeholder="Password"
            defaultValue={password2} 
            onChange={(e) => setPassword2(e.target.value)} 
          />
        </div>
        {/* Signup Button */}
        <div className="flex items-center justify-between pt-4">
          <input
            id="signUpBtn"
            className="bg-gradient-to-r from-purple-800 to-green-500 hover:from-pink-500 hover:to-green-500 text-white font-bold py-2 px-4 rounded focus:ring transform transition hover:scale-105 duration-300 ease-in-out"
            type="submit"
            value="Sign up"
          />
          <div id="messageContainer2" className="messageContainer">{signUpMessage}</div>
        </div>
      </form>
    </div>
  );
}


export default SignUp;