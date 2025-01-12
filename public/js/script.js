const loginLink = document.querySelector('.menu li:nth-child(3)');

const isUserLoggedIn = localStorage.getItem('id');

if(isUserLoggedIn) {
    loginLink.style.display = 'none';
} else {
    loginLink.style.display = 'inline';
}