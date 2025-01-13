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

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/


async function processUserRegister() {

    try {
        // send register
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

        const result = await response.json();
        

        // checks if username or email exist in db
        if (result.error) {
            modal.innerHTML = `<p>${result.error}</p>`;
            modal.showModal();
            return;
        }        
            localStorage.setItem('username', result.username);
            localStorage.setItem('firstName', result.firstName);
            localStorage.setItem('lastName', result.lastName);
            localStorage.setItem('email', result.email);
            localStorage.setItem('password', result.password);

            username.value = '';
            fName.value = '';
            lName.value = '';
            email.value = '';
            password.value = '';

            modal.textContent = 'Registration successful!';
            modal.showModal();

            setTimeout(() => {
                modal.close();
            }, 2000);


    } catch(e) {
        console.error("Error registering user", e);

            modal.textContent = 'An error occurred while registering. Please try again.';
            modal.showModal();

            setTimeout(() => {
                modal.close();
            }, 2000);
        }
    
}

// clears errors
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
        userInput.classList.remove('error-border');
    }

    return isValid;// returns a true when it is valid
}


registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    clearError();

    const isValidFname = valid('fName', value => value.trim() !== '', "First Name is required")
    const isValidLname = valid('lName', value => value.trim() !== '', "Last Name is required")
    const isValidEmail = valid('email', value => emailRegex.test(value), 'Invalid Email Format')
    const isValidUsername = valid('userName', value => value.trim() !== '', "Username is required")
    const isValidPassword = valid('password', value => value.trim() !== '', "Password is required")

    if(isValidFname && isValidLname && isValidEmail && isValidUsername && isValidPassword) {
        processUserRegister();
        // alert('user created');
    }
})
