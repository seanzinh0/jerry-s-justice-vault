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

//contact form validation
document.addEventListener("DOMContentLoaded", function () {
    // Add event listener for form submission
    document.getElementById("contactForm").addEventListener("submit", function (event) {
        const firstName = document.getElementById("firstName").value.trim();
        const lastName = document.getElementById("lastName").value.trim();
        const email = document.getElementById("email").value.trim();
        const message = document.getElementById("message").value.trim();

        // Regex for name validation (no numbers allowed)
        const nameRegex = /^[A-Za-z\s]+$/;

        // Regex for email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        let isValid = true;

        // Validate First Name
        if (!nameRegex.test(firstName)) {
            alert("First Name must not contain numbers or special characters.");
            isValid = false;
        }

        // Validate Last Name
        if (!nameRegex.test(lastName)) {
            alert("Last Name must not contain numbers or special characters.");
            isValid = false;
        }

        // Validate Email
        if (!emailRegex.test(email)) {
            alert("Please enter a valid email address.");
            isValid = false;
        }

        // Validate Message (at least 5 words)
        if (message.split(/\s+/).filter(word => word.length > 0).length < 5) {
            alert("Message must contain at least 5 words.");
            isValid = false;
        }

        // Prevent form submission if any validation fails
        if (!isValid) {
            event.preventDefault();
        }
    });
});
