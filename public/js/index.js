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
