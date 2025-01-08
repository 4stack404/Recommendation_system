const prevBtn = document.getElementById("prevTop10");
const nextBtn = document.getElementById("nextTop10");
const top10Wrapper = document.querySelector(".top-10-wrapper");

// Initialize scroll position
let scrollPosition = 0;

function getMoviesToScroll() {
    const screenWidth = window.innerWidth;
    if (screenWidth < 576) return 1; // Move 1 movie for extra small screens
    if (screenWidth < 768) return 2; // Move 2 movies for small screens
    if (screenWidth < 991) return 3; // Move 3 movies for medium screens
    return 4; // Move 4 movies for large screens
}

function updateCarousel() {
    const movieCardWidth = document.querySelector(".movie-card").offsetWidth;
    const gap = 20; // Adjust if you have a different gap value in your CSS
    const scrollAmount = (movieCardWidth + gap) * getMoviesToScroll();

    const wrapperWidth = top10Wrapper.scrollWidth;
    const containerWidth = document.querySelector(".top-10-container").offsetWidth;

    // Disable buttons if at the edges
    prevBtn.disabled = scrollPosition <= 0;
    nextBtn.disabled = scrollPosition >= wrapperWidth - containerWidth;

    // Apply transform to scroll the movies
    top10Wrapper.style.transform = `translateX(-${scrollPosition}px)`;
}

// Event listener for next button
nextBtn.addEventListener("click", () => {
    const movieCardWidth = document.querySelector(".movie-card").offsetWidth;
    const gap = 20; // Adjust if your CSS has a different gap value
    const scrollAmount = (movieCardWidth + gap) * getMoviesToScroll();

    const wrapperWidth = top10Wrapper.scrollWidth;
    const containerWidth = document.querySelector(".top-10-container").offsetWidth;

    // Ensure we don't scroll beyond the max width
    if (scrollPosition < wrapperWidth - containerWidth) {
        scrollPosition = Math.min(
            scrollPosition + scrollAmount,
            wrapperWidth - containerWidth
        );
    }

    updateCarousel();
});

// Event listener for previous button
prevBtn.addEventListener("click", () => {
    const movieCardWidth = document.querySelector(".movie-card").offsetWidth;
    const gap = 20; // Adjust if your CSS has a different gap value
    const scrollAmount = (movieCardWidth + gap) * getMoviesToScroll();

    // Ensure we don't scroll beyond the minimum (0)
    if (scrollPosition > 0) {
        scrollPosition = Math.max(scrollPosition - scrollAmount, 0);
    }

    updateCarousel();
});

// Update carousel on window resize
window.addEventListener("resize", () => {
    updateCarousel();
});

// Initialize the carousel
updateCarousel();
