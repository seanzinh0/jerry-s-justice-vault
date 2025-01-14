// var init
const registerForm = document.getElementById('register-form');
const fName = document.getElementById('fName');
const lName = document.getElementById('lName');
const email = document.getElementById('email');
const username = document.getElementById('userName');
const password = document.getElementById('password');

const openButton = document.querySelector('[data-open-modal]');
const closeButton = document.querySelector('[data-close-modal]');
const modal = document.querySelector('dialog');
const modalOriginalContent = modal.innerHTML;

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/


async function processUserRegister() {

    try {
        // send user info to db
        const response = await fetch(`/api/register?username=${username.value}&firstName=${fName.value}&lastName=${lName.value}&email=${email.value}&password=${password.value}`, {
            method: 'POST',

            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username.value,
                firstName: fName.value,
                lastName: lName.value,
                email: email.value,
                password: password.value
            })
        });
        // JSON we get back
        const result = await response.json();

        // reset back to original content for when user correctly enters register info 
        modal.innerHTML = modalOriginalContent
        

        // checks if their is an error
        if (result.error) {
            modal.innerHTML = `<p>${result.error}</p>`;
            modal.showModal();

            setTimeout(() => {
                modal.close();
            }, 2000);
            return;
        }        
            // iputs newly createtd user info into db
            localStorage.setItem('username', result.username);
            localStorage.setItem('firstName', result.firstName);
            localStorage.setItem('lastName', result.lastName);
            localStorage.setItem('email', result.email);
            localStorage.setItem('password', result.password);
            
            // clears input fields
            username.value = '';
            fName.value = '';
            lName.value = '';
            email.value = '';
            password.value = '';
            
            // show moodal
            modal.showModal();

            // modal closes in 4s and takes you too login
            setTimeout(() => {
                modal.close();
                window.location.href = '/login';
            }, 4000);

            // error if something happens to user
    } catch(e) {
        console.error("Error registering user", e);

            //shows error msg in modal
            modal.textContent = 'An error occurred while registering. Please try again.';
            modal.showModal();
            setTimeout(() => {
                modal.close();
            }, 2000);
        }
    
}

// clears errors fields
function clearError() {
    const errorMsg = document.querySelectorAll('.error-message')

    errorMsg.forEach(err => (err.textContent = ''))
}


// validates user input
function valid(id, validate, errormsg) {
    const userInput = document.getElementById(id); // get input El
    const errorField = document.getElementById(`${id}-error`) // gets err msg El
    const isValid = validate(userInput.value); // validate using a callback function

    if(!isValid) {
        errorField.textContent = errormsg  // displays errormsg depemding on input box
        userInput.classList.add('error-border') // displays red border when invalid input
    } else {
        userInput.classList.remove('error-border'); // removes error border if input is valid 
    }

    return isValid;// returns a true when it is valid
}

// what happens when user click btn
registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    clearError();

    const isValidFname = valid('fName', value => value.trim() !== '', "First Name is required")
    const isValidLname = valid('lName', value => value.trim() !== '', "Last Name is required")
    const isValidEmail = valid('email', value => emailRegex.test(value), 'Invalid Email Format')
    const isValidUsername = valid('userName', value => value.trim() !== '', "Username is required")
    const isValidPassword = valid('password', value => value.trim() !== '', "Password is required")

    // checks if all input fields are valid in the frontend
    if(isValidFname && isValidLname && isValidEmail && isValidUsername && isValidPassword) {
        processUserRegister();
    }
})
