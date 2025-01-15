// Pulls user data from the database and displays it 
document.addEventListener('DOMContentLoaded', () => {
    const userId = localStorage.getItem('id');
    const accountContainer = document.getElementById('account-container');
    const interestedCasesSection = document.querySelector('#interested-cases');
    const saveChangesButton = document.getElementById('save-changes-btn');
    const successMessageDiv = document.getElementById('success-message');

    // Blur Modal for account page
    function showModal() {
        if (accountContainer) {
            accountContainer.classList.add('blur');
        }

        // Get the modal element 
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

        // Go to login button on blurry modal
        document.getElementById('redirect-login').addEventListener('click', () => {
            window.location.href = '/login';
        });
    }

    // Shows modal if user isn't signed in
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
        //Checks if the response is ok
        if (!response.ok) {
            throw new Error('User not logged in or not found')
        }
        return response.json();
    })
    .then(user => {
        // Populates the account form
        document.getElementById('username').value = user.username || '';
        document.getElementById('first-name').value = user.firstName || '';
        document.getElementById('last-name').value = user.lastName || '';
        document.getElementById('user-email').value = user.email || '';

        // Greeting above the account info container
        const helloUserMessage = document.getElementById('hello-user');
        if (helloUserMessage && user.firstName) {
            helloUserMessage.textContent = `Welcome, ${user.firstName}!`;
        } 
    })
    .catch(error => {
        console.error('Error fetching user data:', error);
        alert('Error loading user information. Please log in or create an account.');
    });

    // Save changes to user
    saveChangesButton.addEventListener('click', async () => {
        const updatedData = {
            id: userId,
            username: document.getElementById('username').value,
            firstName: document.getElementById('first-name').value,
            lastName: document.getElementById('last-name').value,
            email: document.getElementById('user-email').value,
        };

        try {
            const response = await fetch('/api/updateUser', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedData)
            });
            if (!response.ok) {
                throw new Error('Failed to save changes');
            }
            const result = await response.json();

            successMessageDiv.textContent = result.message || 'Changes saved successfully';
            successMessageDiv.style.display = 'block';
            setTimeout(() => {
                successMessageDiv.style.display = 'none'
            }, 5000);
        } catch (error) {
            console.error('Error saving changes:', error);
            successMessageDiv.textContent = 'Failed to save changes. Please try again.';
            successMessageDiv.style.color = 'red';
            successMessageDiv.style.display = 'block';
        }
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
            // Checks if there are no interested cases
            if (!cases.length) {
                interestedCasesSection.innerHTML = '<p>No interested cases found.</p>';
                return;
            }

            // Bookmarked Cases Cards
            const caseHTML = cases.map(c => `
                <div class="case-card" data-id="${c.id}">
                    <h4>${c.caseName}</h4>
                    <p><strong>Attorney:</strong> ${c.attorney || 'N/A'}</p>
                    <p><strong>Court:</strong> ${c.court}</p>
                    <p><strong>Date Filed:</strong> ${c.dateFiled}</p>
                    <p><strong>Snippet:</strong> ${c.snippet}</p>
                    <a href="${c.doc}" target="_blank" class="case-doc">View Document</a>
                    <button class="delete-card-btn" aria-label="Delete Bookmark">&times;</button>
                </div>
                `).join('');
            interestedCasesSection.innerHTML = caseHTML;

            // Delete card button 
            const deleteButtons = document.querySelectorAll('.delete-card-btn');
            deleteButtons.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const caseCard = e.target.closest('.case-card');
                    const bookmarkID = caseCard.dataset.id; // Get bookmark ID from the data attribute
                    deleteBookMark(bookmarkID, caseCard);
                });
            });
        })
        .catch(error => {
            console.error('Error fetching interested cases:', error);
            interestedCasesSection.innerHTML = '<p>Error loading interested cases.</p>'
        });

        // Bookmark Deletion
        function deleteBookMark(bookmarkID, caseCard) {
            fetch(`/api/deleteBookmark?id=${bookmarkID}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: bookmarkID}),
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to delete bookmark');
                }
                return response.json();
            })
            .then(result => {
                console.log(result?.message || 'Bookmark deleted');
                //Removes card from the UI
                caseCard.remove();
            })
            .catch(error => {
                console.error('Error deleting bookmark:', error.message || error);
                alert('Failed to delete bookmark. Please try again later.');
            });
        }
});
