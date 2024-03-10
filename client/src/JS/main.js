
// JS/main.js
let users = [
    { username: 'user1', password: '00001' },
    { username: 'user2', password: '00002' },
    { username: 'user3', password: '00003' },
    { username: 'user4', password: '00004' },
    { username: 'user5', password: '00005' },
    { username: 'user6', password: '00006' },
    { username: 'user7', password: '00007' },
    { username: 'user8', password: '00008' },
    { username: 'user9', password: '00009' },
    { username: 'user10', password: '00010' },
    { username: 'user11', password: '00011' },
    { username: 'user12', password: '00012' },
    { username: 'user13', password: '00013' },
    { username: 'user14', password: '00014' },
    { username: 'user15', password: '00015' },
    { username: 'user16', password: '00016' },
    { username: 'user17', password: '00017' },
    { username: 'user18', password: '00018' },
    { username: 'user19', password: '00019' },
    { username: 'user20', password: '00020' },
    { username: 'user21', password: '00021' },
    { username: 'user22', password: '00022' },
    { username: 'user23', password: '00023' },
    { username: 'user24', password: '00024' },
];



// Select the forms and buttons by their IDs
const signupForm = document.getElementById('signupForm');
const signupTitle = document.getElementById('signupTitle');
const loginForm = document.getElementById('loginForm');
const loginTitle = document.getElementById('loginTitle');
const logoutBtn = document.getElementById('logoutButton');
const loginBtn = document.getElementById('loginBtn');
const loginDisplay = document.getElementById('userNameDisplay');
const loginMessage = document.getElementById('messageContainer');
const signUpMessage = document.getElementById('messageContainer2');

var userName = localStorage.getItem('userName') ;

if (userName != null) 
{
  // User is not log in
  hideLoginAndSignUp();
}
else
{
    hideLogOut();
}

function signIn(event) // this function get data from db and check if the given data is correct from the login ui
{
    event.preventDefault();
    const userNameInput = document.getElementById('userName1');
    const passwordInput = document.getElementById('password1');
    const passwordText = passwordInput.value;
    const userNameText = userNameInput.value;
    const user = users.find(user => user.username === userNameText); // search for match userName
    if(user!=null) // if user name is valid check password
    {
        if(user.password===passwordText) // if password also valid
        {
            localStorage.setItem('userName', userNameText) // save in the local storage the name of the user
            hideLoginAndSignUp(); // hidel ogin and sighnup
            console.log('User logged in');
        }
        else // password incorrectr display message
        {
            loginMessage.innerText="incorrect password.";
        }
    }
    else
    {
        loginMessage.innerText="user doesnt exist.";
    }
}

function signUp(event)
{
    event.preventDefault();
    const userNameInput = document.getElementById('userName2').value;
    const passwordInput1 = document.getElementById('password2').value;
    const passwordInput2 = document.getElementById('password3').value;
    const user = users.find(user => user.username === userNameInput); // search for match userName
    if(user!=null)
    {
        signUpMessage.innerText="user name allready exist.";
    }
    else
    {
        if(passwordInput1=='' || passwordInput2=='' || userNameInput=='')
        {
            signUpMessage.innerText="use most fill all fields";
        }
        else if(passwordInput1===passwordInput2)
        {
            newUser = { username: userNameInput, password: passwordInput1 }
            users.push(newUser);
            showSignupSuccessMessage();
            document.getElementById('signupForm').reset();
            signUpMessage.innerText="";
            
        }
        else
        {
            signUpMessage.innerText="Passwords do not match.";
        }
    }
}

function logOut()
{
    localStorage.removeItem('userName');
    console.log('User logged out');
    window.location.reload();

}

logoutBtn.addEventListener('click', logOut)


function hideLoginAndSignUp()
{
    signupForm.style.display = 'none';
    signupTitle.style.display = 'none';
    loginForm.style.display = 'none';
    logoutBtn.style.display = 'block';
    loginDisplay.innerText="Welcome Back"+" "+localStorage.getItem('userName');
    loginDisplay.style.display='block';
}

function hideLogOut()
{
    logoutBtn.style.display = 'none';
}

function showSignupSuccessMessage() {
    // Display a simple alert popup
    alert('Signup successful! Welcome to Cryptocurrency Exchange Simulator.');
}

window.addEventListener('unload', function (event) {
    localStorage.removeItem('userName');
});