const url = "https://b6-hkrb.onrender.com"; //for debug use "http://localhost:5500" when pushing use https://b6-hkrb.onrender.com

/**
 * Authenticates a user by sending a POST request to the server with the provided username and password.
 * @param {string} userName - The username of the user.
 * @param {string} password - The password of the user.
 * @returns {Promise<Object>} - A promise that resolves to the server response or an error object.
 */
export function authenticateUser(userName, password) {
  return fetch(url + "/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: userName,
      password: password,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data); // Log the server response
      return data; // Return the server response
    })
    .catch((error) => {
      console.error("Error:", error);
      return { success: false, message: "Error during authentication" };
    });
}

export function depositFunds(userName, amount) {
  /**
   * Deposits funds for a user.
   * @param {string} userName - The username of the user.
   * @param {number} amount - The amount of funds to deposit.
   * @returns {Promise} - A promise that resolves to the server response.
   */
  return fetch(url + "/deposit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: userName,
      amount: amount,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data); // Log the server response
      return data; // Return the server response
    })
    .catch((error) => {
      console.error("Error:", error);
      return { success: false, message: "Error during authentication" };
    });
}

/**
 * Retrieves the user's wallet details from the server.
 * @param {string} userName - The username of the user.
 * @returns {Promise<object>} - A promise that resolves to the server response.
 */
export function getUserWallet(userName) {
  return fetch(url + "/walletBalance", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: userName,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data); // Log the server response
      return data; // Return the server response
    })
    .catch((error) => {
      console.error("Error:", error);
      return { success: false, message: "Error during authentication" };
    });
}

/**
 * Checks if the user's token is active by making a GET request to the "/profile" endpoint.
 * @returns {Promise<boolean>} A promise that resolves to a boolean indicating if the token is active.
 */
export const checkActiveToken = async () => {
  try {
    const token = localStorage.getItem("authToken");
    console.log(token);
    const response = await fetch(url + "/profile", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response); // Log the entire response for inspection

    if (response.ok) {
      const data = await response.json();
      return data.loggedIn;
    } else {
      console.error(`Error: ${response.status} - ${response.statusText}`);
      // Handle other errors if needed
      return false;
    }
  } catch (error) {
    console.error("Error:", error);
    return false;
    // Handle fetch errors if needed
  }
};

/**
 * Checks if a username is available by making a POST request to the server.
 * @param {string} userName - The username to check availability for.
 * @returns {Promise<boolean>} - A promise that resolves to a boolean indicating whether the username is available or not.
 * @throws {Error} - If the network response is not ok or an error occurs during the request.
 */
export async function userNameAvailable(userName) {
  try {
    const response = await fetch(url + "/userExist", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: userName }),
    });

    console.log("Response:", response); // Log the response object

    if (response.ok) {
      const data = await response.json(); // Get JSON response
      return data.validName; // Return whether username is valid or not
    } else {
      throw new Error("Network response was not ok"); // Throw error for other status codes
    }
  } catch (error) {
    console.error("Error checking username availability:", error);
    throw error; // Rethrow the error to be handled by the caller
  }
}

/**
 * Registers a user with the provided username and password.
 * @param {string} userName - The username of the user to register.
 * @param {string} password - The password of the user to register.
 * @returns {Promise} - A promise that resolves to the response data if successful, or rejects with an error if unsuccessful.
 */
export async function register(userName, password) {
  try {
    const response = await fetch(url + "/register", {
      // Corrected typo here
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userName: userName, password: password }), // Corrected typo here
    });

    console.log("Response:", response); // Log the response object

    if (response.ok) {
      const data = await response.json(); // Get JSON response
      return data;
    } else {
      throw new Error("Network response was not ok"); // Throw error for other status codes
    }
  } catch (error) {
    console.error("Error registering username:", error);
    throw error; // Rethrow the error to be handled by the caller
  }
}

/**
 * Makes a purchase request to the server.
 * @param {string} userName - The username of the user making the purchase.
 * @param {number} coinAmount - The amount of coins to purchase.
 * @param {string} coinName - The name of the coin to purchase.
 * @param {string} payment - The payment method for the purchase.
 * @returns {Promise<any>} - A promise that resolves to the response data from the server.
 * @throws {Error} - If the network response is not ok.
 */
export async function purchase(userName, coinAmount, coinName, payment) {
  try {
    const response = await fetch(url + "/purchase", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: userName,
        coinAmount: coinAmount,
        coinName: coinName,
        payment: payment,
      }),
    });

    console.log("Response of purchase:", response); // Log the response object

    if (response.ok) {
      const data = await response.json(); // Get JSON response
      return data;
    } else {
      throw new Error("Network response was not ok"); // Throw error for other status codes
    }
  } catch (error) {
    console.error("Error completing the purchase:", error);
    throw error; // Rethrow the error to be handled by the caller
  }
}

/**
 * Updates the user's sell action by sending a POST request to the server.
 * @param {string} userName - The name of the user.
 * @param {string} coinName - The name of the coin.
 * @param {number} newCoinsInWallet - The new number of coins in the user's wallet.
 * @param {number} newBalance - The new balance of the user.
 * @returns {Promise<any>} - A promise that resolves to the response data from the server.
 * @throws {Error} - If the network response is not ok.
 */
export async function updateUserSell(
  userName,
  coinName,
  newCoinsInWallet,
  newBalance
) {
  try {
    const response = await fetch(url + "/updateSell", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userName: userName,
        coinName: coinName,
        newCoinsInWallet: newCoinsInWallet,
        newBalance: newBalance,
      }),
    });

    console.log("Response of updateUserSell:", response); // Log the response object

    if (response.ok) {
      const data = await response.json(); // Get JSON response
      return data;
    } else {
      throw new Error("Network response was not ok"); // Throw error for other status codes
    }
  } catch (error) {
    console.error("Error completing the sell action:", error);
    throw error; // Rethrow the error to be handled by the caller
  }
}

/**
 * Retrieves user data from the server.
 * @returns {Promise<Object>} The user data.
 * @throws {Error} If there is an error retrieving the data.
 */
export const getUserData = async () => {
  try {
    const userName = localStorage.getItem("userName");
    console.log("from getUserData :" + userName);
    const response = await fetch(url + "/userData", {
      method: "GET",
      headers: {
        Authorization: userName,
      },
    });
    console.log("response form getUserData: ", response); // Log the entire response for inspection

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

/**
 * Retrieves all user data from the server.
 * @returns {Promise<Object>} A promise that resolves to the retrieved user data.
 * @throws {Error} If there is an error retrieving the data.
 */
export const getAllUserData = async () => {
  try {
    const response = await fetch(url + "/AlluserData", {
      method: "GET",
    });
    console.log("response form getAllUserData: ", response); // Log the entire response for inspection

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
