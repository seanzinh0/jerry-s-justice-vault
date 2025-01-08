const form = document.querySelector(".form");
const userPassword = document.querySelector('#password').value.trim();
const username = document.querySelector('#username').value.trim();


async function processUserLogin() {
    try {
        // Fetch user id
        const response = await fetch(`/api/login?username=${username}&password=${userPassword}`, {
            method: 'POST',
            
         }
        );
        const userId = await response.json();
        console.log(userId)

        //error handling
        if(!userId) {
            alert('You need to register for account')
        } else {
            localStorage.setItem('id', userId)
            alert("Login successful!");

            setTimeout(() => {
                window.location.href = '/api/account'
            }, 1000)
        }     

    } catch (e) {
        console.error("Error fetching user id:", e);
    }
}
   


form.addEventListener('submit', async () => {
   await processUserLogin();
})
