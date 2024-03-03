document
  .getElementById("loginForm")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the default form submission

    // Retrieve username and password from the form
    const username = document.getElementById("username1").value;
    const password = document.getElementById("password2").value;

    // Use fetch to send the username and password to the server
    fetch("http://127.0.0.1:5500/script.js ", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    })
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => console.error("Error:", error));
  });

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
