// Pulls user data from the database and displays it 
document.addEventListener('DOMContentLoaded', () => {
    const userId = localStorage.getItem('id');
    const accountContainer = document.getElementById('account-container');
    const interestedCasesSection = document.querySelector('#interested-cases');

    // Blur Modal for account page
    function showModal() {
        if (accountContainer) {
            accountContainer.classList.add('blur');
        }

        const modal = document.getElementById('account-modal');
        modal.style.display = 'block';
        modal.innerHTML = 
        `
        <div class="modal-content">
            <h2>You are not logged in</h2>
            <p>Please log in or register to access your account.</p>
            <button id="redirect-login" class="modal-button">
                Go to login page
            </button>
        </div>
        `;

        document.getElementById('redirect-login').addEventListener('click', () => {
            window.location.href = '/login';
        });
    }

    if (!userId) {
        showModal();
        return;
    }

    // Fetches user data based on ID
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

        // Greeting above the account info container
        const helloUserMessage = document.getElementById('hello-user');
        if (helloUserMessage && user.firstName) {
            helloUserMessage.textContent = `Hello, ${user.firstName}`;
        } 
    })
    .catch(error => {
        console.error('Error fetching user data:', error);
        alert('Error loading user information. Please log in or create an account.');
    });

    // Logout functionality
    const logoutButton = document.getElementById('logout-btn');
    if (logoutButton) {
        logoutButton.addEventListener('click', async () => {
            localStorage.removeItem('id');
            localStorage.removeItem('username');
            localStorage.removeItem('firstName');
            localStorage.removeItem('lastName');
            localStorage.removeItem('email');

            window.location.href = '/login';
        });
    }

    // Fetches & displays users interested cases
    // function fetchInterestedCases(userId) {
        fetch(`/api/cases?id=${userId}`, {
            method: 'GET',
            credentials: 'include',
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch interested cases');
            }
            return response.json();
        })
        .then(cases => {
            if (!cases.length) {
                interestedCasesSection.innerHTML = '<p>No interested cases found.</p>';
                return;
            }

            const caseHTML = cases.map(c => `
                <div class="case-card">
                    <h4>${c.caseName}</h4>
                    <p><strong>Attorney:</strong> ${c.attorney || 'N/A'}</p>
                    <p><strong>Court:</strong> ${c.court}</p>
                    <p><strong>Date Filed:</strong> ${c.dateFiled}</p>
                    <p><strong>Snippet:</strong> ${c.snippet}</p>
                    <a href="${c.doc}" target="_blank" class="case-doc">View Document</a>
                </div>
                `).join('');
            interestedCasesSection.innerHTML = caseHTML;
        })
        .catch(error => {
            console.error('Error fetching interested cases:', error);
            interestedCasesSection.innerHTML = '<p>Error loading interested cases.</p>'
        })
    // }
});
