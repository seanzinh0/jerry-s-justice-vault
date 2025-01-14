// Select the elements needed for the slider
const slider = document.querySelector('.testimonial-slider'); 
const slides = document.querySelectorAll('.slide'); 
const prevButton = document.getElementById('prev'); 
const nextButton = document.getElementById('next'); 

// Initialize the current index to keep track of the visible slide
let currentIndex = 0;

// Function to update the slider position based on the current index
function updateSlider() {
    // Calculate the offset for the translation based on the current index
    const offset = -currentIndex * 100; 
    // Apply the translation to move the slider
    slider.style.transform = `translateX(${offset}%)`;
}

// Event listener for the previous button
prevButton.addEventListener('click', () => {
    // If we're not at the first slide, decrement the index
    // If at the first slide, go to the last slide
    currentIndex = (currentIndex > 0) ? currentIndex - 1 : slides.length - 1;
    // Update the slider position
    updateSlider();
});

// Event listener for the next button
nextButton.addEventListener('click', () => {
    // If we're not at the last slide, increment the index
    // If at the last slide, go to the first slide
    currentIndex = (currentIndex < slides.length - 1) ? currentIndex + 1 : 0;
    // Update the slider position
    updateSlider();
});

//FAQ dropdown
document.querySelectorAll('.faq-question').forEach((question) => {
    question.addEventListener('click', () => {
        const faqItem = question.parentElement;
        faqItem.classList.toggle('active');
    });
});


document.addEventListener("DOMContentLoaded", function () {
    // Add event listener for form submission
    document.getElementById("contactForm").addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent form submission
        
        const firstName = document.getElementById("firstName").value.trim();
        const lastName = document.getElementById("lastName").value.trim();
        const email = document.getElementById("email").value.trim();
        const message = document.getElementById("message").value.trim();

        // Error messages
        const fNameError = document.getElementById("fName-error");
        const lNameError = document.getElementById("lName-error");
        const emailError = document.getElementById("email-error");
        const messageError = document.getElementById("message-error");

        // Regex for validation
        const nameRegex = /^[A-Za-z\s]+$/; // Name: letters and spaces only
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email regex

        let isValid = true;

        // Reset error messages
        fNameError.style.display = 'none';
        lNameError.style.display = 'none';
        emailError.style.display = 'none';
        messageError.style.display = 'none';

        // Validate First Name
        if (!nameRegex.test(firstName)) {
            fNameError.textContent = "First Name must not contain numbers or special characters.";
            fNameError.style.display = 'block';
            isValid = false;
        }

        // Validate Last Name
        if (!nameRegex.test(lastName)) {
            lNameError.textContent = "Last Name must not contain numbers or special characters.";
            lNameError.style.display = 'block';
            isValid = false;
        }

        // Validate Email
        if (!emailRegex.test(email)) {
            emailError.textContent = "Please enter a valid email address.";
            emailError.style.display = 'block';
            isValid = false;
        }

        // Validate Message (at least 5 words)
        if (message.split(/\s+/).filter(word => word.length > 0).length < 5) {
            messageError.textContent = "Message must contain at least 5 words.";
            messageError.style.display = 'block';
            isValid = false;
        }

        // Prevent form submission if validation fails
        if (isValid) {
            // Form is valid, proceed with submission
            alert("Form submitted successfully!");
        } else {
            console.log("Form validation failed.");
        }
    });
});
