
const url = "https://b6-hkrb.onrender.com"; //for debug use "http://localhost:5500" when pushing use https://b6-hkrb.onrender.com

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


export const getAllUserData = async () => {
  try {
    const response = await fetch(url + "/AlluserData", {
      method: "GET",
    });
    console.log("response form getAllUserData: ",response); // Log the entire response for inspection

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
