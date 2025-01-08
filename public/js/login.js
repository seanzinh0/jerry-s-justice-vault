const form = document.querySelector(".form");
const userPassword = document.querySelector('#password').value.trim();
const userEmail = document.querySelector('#email').value.trim();

const authUser = async (email, password) => {
    let isLoggedIn = false;

    try {
        // Fetch user data
        const response = await fetch(`api/login`, {
            method: "GET",
            headers: { Accept: "application/json" },
        });

        const userDataJSON = await response.json();

        // Validate password
        if (userDataJSON.password !== password) {
            alert("The password was incorrect");
            window.location.href = "/login";
            return;
        } else {
            isLoggedIn = true;
        }

        alert("Login successful!");
    } catch (e) {
        console.error("Error authenticating user:", e);
    }
};


form.addEventListener('submit', () => {
    authUser()
})
