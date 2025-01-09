const form = document.querySelector(".login-form");
const username = document.querySelector("#username");
const password = document.querySelector("#password");

async function processUserLogin() {
    try { 
        // Fetch user id
        const response = await fetch(`/api/login?username=${username.value}&password=${password.value}`, {
            method: 'POST',
         })
           const result = await response.json();
           //if user is already logged in and is trying to log in again with the same account 
           if(localStorage.getItem('id') !== null && !result.error) {
                alert('You are already logged in') 
                return;  
        }

        //if username and password aren't in db
        if(result.error) {
            alert(result.error);
            return;
        } else {
            localStorage.setItem('id', result.id)
            alert("Login successful!");
        }     

    } catch (e) {
        console.error("Error fetching user id:", e);
    }
}
   

form.addEventListener('submit', (e) => {
    e.preventDefault();
    processUserLogin();
});
