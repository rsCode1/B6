import React from 'react';

function SignUp() {
  const onSignUp = (event) => {
    // Your sign-up logic here
    event.preventDefault(); // Prevents the default form submission behavior
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
      <form id="signupForm" onSubmit={onSignUp} className="bg-gray-900 opacity-75 w-full max-w-md shadow-lg rounded-lg px-8 pt-6 pb-8 mb-4">
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
          />
        </div>
        {/* Password1 */}
        <div className="mb-4">
          <input
            className="shadow appearance-none border rounded w-full p-3 text-gray-700 leading-tight focus:ring transform transition hover:scale-105 duration-300 ease-in-out"
            id="password2"
            type="text"
            placeholder="Password"
          />
        </div>
        {/* Password2 */}
        <div>
          <input
            className="shadow appearance-none border rounded w-full p-3 text-gray-700 leading-tight focus:ring transform transition hover:scale-105 duration-300 ease-in-out"
            id="password3"
            type="text"
            placeholder="Password"
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
          <div id="messageContainer2"></div>
        </div>
      </form>
    </div>
  );
}


// Export the function, not its invocation
export default SignUp;