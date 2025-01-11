const loginLink = document.querySelector('.menu li:nth-child(3)');
const registerLink = document.querySelector('.menu li:nth-child(4)');

const isUserLoggedIn = localStorage.getItem('id');

if(isUserLoggedIn) {
    loginLink.style.display = 'none';
    registerLink.style.display = 'none';
} else {
    loginLink.style.display = 'inline';
    registerLink.style.display = 'inline';
}