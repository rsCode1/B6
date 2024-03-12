
const url ="http://127.0.0.1:5500"
    export function authenticateUser(userName, password) {
      return fetch(url+"/login", {
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

    export const checkActiveToken = async () => {
      try {
        const token = localStorage.getItem('authToken');
        console.log(token);
        const response = await fetch(url+"/profile", {
          method: "GET",
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        console.log(response);  // Log the entire response for inspection
    
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
    
    export async function endActiveToken() {
      // Retrieve the token from local storage
      const token = localStorage.getItem('authToken');
    
      if (token) {
        try {
          // Send the token to the server for revocation
          await fetch('http://your-server-url/revoke-token', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token }),
          });
    
          // Remove the token from local storage
          localStorage.removeItem('authToken');
        } catch (error) {
          console.error('Error revoking token:', error);
        }
      }
    }


// document.getElementById("createData").addEventListener("submit", function (event) {
//     event.preventDefault();
//     const formData = new FormData(this);
//     const jsonData = Object.fromEntries(formData.entries());

//     fetch("http://localhost:3000/data", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(jsonData),
//     })
//       .then((response) => response.json())
//       .then((data) => {
//         console.log("Success:", data);
//         // Optionally, trigger fetch to update the list
//         document.getElementById("fetchData").click();
//       })
//       .catch((error) => {
//         console.error("Error:", error);
//       });
//   });
