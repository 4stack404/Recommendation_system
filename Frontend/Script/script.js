const slider = document.querySelector(".slider");
const slides = document.querySelectorAll(".slide");
const navDots = document.querySelectorAll(".slider-nav a");

let currentIndex = 0;

// Function to move the slider and update active dot
function moveSlider(index) {
    slider.style.transform = `translateX(-${index * 100}%)`;
    updateActiveDot(index);
}

// Function to update active dot
function updateActiveDot(index) {
    navDots.forEach((dot, i) => {
        dot.classList.toggle("active", i === index); // Add 'active' class to current dot
    });
}

// Add event listeners to navigation dots
navDots.forEach((dot, index) => {
    dot.addEventListener("click", (event) => {
        event.preventDefault(); // Prevent default anchor behavior
        currentIndex = index;
        moveSlider(currentIndex);
    });
});

// Add click events for left and right arrows
document.querySelector(".right-arrow").addEventListener("click", () => {
    if (currentIndex < slides.length - 1) {
        currentIndex++;
        moveSlider(currentIndex);
    }
});

document.querySelector(".left-arrow").addEventListener("click", () => {
    if (currentIndex > 0) {
        currentIndex--;
        moveSlider(currentIndex);
    }
});

// Set the first dot as active on page load
updateActiveDot(currentIndex);


//Top 10 Movies Slider

const carousel = document.querySelector(".carousel-container");
const movieCards = document.querySelectorAll(".movieCard");
const arrowLeft = document.querySelector(".arrow-left");
const arrowRight = document.querySelector(".arrow-right");

let currentPosition = 0; // Track the current position of the carousel

function updateCarousel() {
    // Dynamically calculate card width, including the gap
    const cardWidth = movieCards[0].offsetWidth + 20; // Add gap between cards
    const maxScrollPosition = (movieCards.length * cardWidth) - carousel.offsetWidth;

    // Update arrow click events with new values
    arrowRight.addEventListener("click", () => {
        if (currentPosition < maxScrollPosition) {
            currentPosition += cardWidth;
            carousel.style.transform = `translateX(-${currentPosition}px)`;
        }
    });

    arrowLeft.addEventListener("click", () => {
        if (currentPosition > 0) {
            currentPosition -= cardWidth;
            carousel.style.transform = `translateX(-${currentPosition}px)`;
        }
    });
}

// Recalculate values on window resize
window.addEventListener("resize", () => {
    currentPosition = 0; // Reset position
    carousel.style.transform = "translateX(0px)"; // Reset transform
    updateCarousel(); // Recalculate values
});

// Initialize carousel
updateCarousel();

// Background Image updater

// Get all movie cards
// const movieCards = document.querySelectorAll('.movieCard');

// Listen for hover event on each movie card
const mainElement = document.querySelector('main');


movieCards.forEach(card => {
    card.addEventListener("mouseenter", function () {
        // Get the custom image URL stored in the data-image attribute
        const customImage = card.getAttribute("data-image");
        
        // Set the background image for the ::before pseudo-element
        mainElement.style.setProperty("--background-image", `url(${customImage})`);
        mainElement.classList.add("active");
    });

    card.addEventListener("mouseleave", function () {
        // Remove the background image when hover ends
        mainElement.classList.remove("active");
    });
});
