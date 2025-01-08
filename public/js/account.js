// const queries = require('../../src/database/databaseQueries.js');
// const pool = require('../../src/database/connectionPool.js')
// const userInfo = document.querySelector('#user-info');


document.addEventListener('DOMContentLoaded', () => {
    fetch('/account')
    .then(response => {
        if (!response.ok) {
            throw new Error('User not logged in or not found')
        }
        return response.json();
    })
    .then(user => {
        document.getElementById('username').value = user.username;
        document.getElementById('first-name').value = user.firstName;
        document.getElementById('last-name').value = user.lastName;
        document.getElementById('user-email').value = user.email;
    })
    .catch(error => {
        console.error('Error fetching user data:', error);
        alert('Error loading user information. Please log in or create an account.');
    })
})







// OLD CODE
// import pool from '../../src/database/connectionPool.js';
// import fetchUserData from '../../src/database/databaseQueries.js';
/* here in case of innerHTML insertion
        `<div class="user-info">
            <p><strong>Username: ${username} </strong></p>
            <p><strong>First Name: ${firstName} </strong></p>
            <p><strong>Last Name: ${lastName} </strong></p>
            <p><strong>Email: ${email} </strong></p>
            <p><strong>Password: ${password} </strong></p>
        </div>`
*/