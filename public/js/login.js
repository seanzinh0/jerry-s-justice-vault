// const form = document.querySelector(".form");

// const authUser = async (username, password) => {
//     let isLoggedIn = false;

//     try {
//         // Fetch user data
//         const response = await fetch(`api/login?username=${encodeURIComponent(username)}`, {
//             method: "GET",
//             headers: { Accept: "application/json" },
//         });

//         const userDataJSON = await response.json();

//         // Validate password
//         if (userDataJSON.password !== password) {
//             alert("The password was incorrect");
//             window.location.href = "/login";
//             return;
//         } else {
//             isLoggedIn = true;
//         }

//         // Update login status
//         await fetch(`api/login?username=${encodeURIComponent(username)}&loggedIn=${isLoggedIn}`, {
//             method: "PATCH",
//             headers: { Accept: "application/json" },
//         });

//         alert("Login successful!");
//     } catch (e) {
//         console.error("Error authenticating user:", e);
//     }
// };


// form.addEventListener('submit', () => {
//     authUser
// })
