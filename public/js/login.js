const form = document.querySelector(".form");

async function processUserLogin(e) {
    e.preventDefault();
    try {
        const username = document.querySelector("#username");
        const password = document.querySelector("#password");
        // Fetch user id
        const response = await fetch(`/api/login?username=${username.value}&password=${password.value}`, {
            method: 'POST',
         }
        );

        const result = await response.json();

        //error handling
        if(result.error) {
            alert(result.error);
        } else {
            localStorage.setItem('id', result.id)
            alert("Login successful!");
        }     

    } catch (e) {
        console.error("Error fetching user id:", e);
    }
}
   


form.addEventListener('submit', processUserLogin);
