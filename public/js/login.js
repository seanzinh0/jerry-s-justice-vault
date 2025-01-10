const form = document.querySelector(".login-form");
const username = document.querySelector("#username");
const password = document.querySelector("#password");

const openButton = document.querySelector('[data-open-modal]')
const closeButton = document.querySelector('[data-close-modal]')
const modal = document.querySelector('dialog')

async function processUserLogin() {
    if(username.value.trim() === "" || password.value.trim() === "") {
        modal.textContent = "You haven't entered a value for a field, try again"
        modal.showModal()
        
        setTimeout(() => {
          modal.close();
        }, 2000)
        return;
    }
    
    try { 
        // Fetch user id
        const response = await fetch(`/api/login?username=${username.value}&password=${password.value}`, {
            method: 'POST',
         })
           const result = await response.json();

          
           //if user is already logged in and is trying to log in again with the same account 
           if(localStorage.getItem('id') !== null) {
            modal.innerHTML = `<p>You are already logged in, Press the link below to be taken to your account page<p><a href=/account>Your Account</a>`
            modal.showModal()
            return;  
        }
     
            localStorage.setItem('id', result.id)
            modal.textContent = 'Login successful!'
            modal.showModal()
            
            setTimeout(() => {
                modal.close()
            }, 2000)
      

    } catch (e) {
        console.error("Error fetching user id:", e);
        //if username and password aren't in db
        if(e) {
            modal.textContent = 'No user exist with that information, Please try again.'
            modal.showModal()

            setTimeout(() => {
                modal.close();
            }, 2000)
        }
    }
}
   


form.addEventListener('submit', (e) => {
    e.preventDefault();
    processUserLogin();
});
