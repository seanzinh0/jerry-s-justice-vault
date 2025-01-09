// const queries = require('../../src/database/databaseQueries.js');
// const pool = require('../../src/database/connectionPool.js')
// import { getAccountInfoById } from '../../src/database/databaseQueries.js';
// const userInfo = document.querySelector('#user-info');

// Pulls user data from the database and displays it 
document.addEventListener('DOMContentLoaded', () => {
    const userId = localStorage.getItem('id');
    if (!userId) {
        alert('You are not logged in. Please log in to access your account.')
        return;
    }
    fetch(`/api/account?id=${userId}`, {
        method: 'GET',
        credentials: 'include',
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('User not logged in or not found')
        }
        return response.json();
    })
    .then(user => {
        document.getElementById('username').value = user.username || '';
        document.getElementById('first-name').value = user.firstName || '';
        document.getElementById('last-name').value = user.lastName || '';
        document.getElementById('user-email').value = user.email || '';
    })
    .catch(error => {
        console.error('Error fetching user data:', error);
        alert('Error loading user information. Please log in or create an account.');
    });

    const logoutButton = document.getElementById('logout-btn');
    if (logoutButton) {
        logoutButton.addEventListener('click', async () => {
            localStorage.removeItem('id');
            localStorage.removeItem('username');
            localStorage.removeItem('firstName');
            localStorage.removeItem('lastName');
            localStorage.removeItem('email');

            window.location.href = '/login';
        })
    }
});







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