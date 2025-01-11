//Loader
window.addEventListener("load", () => {
    // const loader = document.querySelector(".loader");
    // loader.classList.add("hidden");

    setTimeout(() => {
        const loader = document.querySelector(".loader");
        loader.classList.add("hidden"); // Add 'hidden' class
    }, 2000); // 2-second delay for smooth animation
});

//API CALL 

let movieIds = [];

async function getMoviesInitial() {
    let moviesString = localStorage.getItem("selectedMovies");
    let moviesObject = JSON.parse(moviesString);

    let movieNames = "";
    movieIds = [];

    moviesObject.forEach((movie, index) => {
        movieNames += movie.original_title;
        if (index < moviesObject.length - 1) {
            movieNames += ",";
        }
        movieIds.push(movie.id);
    });

    let url1 = `https://recommendation-system-4g5y.onrender.com/recommend/${movieNames}`;

    // console.log("Fetching from URL:", url1);

    try {
        const response = await fetch(url1);

        if (!response.ok) {
            throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
        }

       const data = await response.json(); //Parse the response as JSON
    //    console.log("API Response:", data);

    // Extract the recommendations array
       const movies = data.recommendations || [];
        // console.log("Recommendations:", movies);

        const slides = document.querySelectorAll(".slide");

        // Display the top 3 recommended movies
        movies.slice(0,3).forEach((movie,index) => {
            const slide = slides[index];

            if(slide){
                slide.querySelector(".slide-title").textContent = movie.title;
                slide.querySelector(".rating").textContent = `⭐ ${movie.rating}`;
                slide.querySelector(".release-date").textContent = movie.release_date;  

                const genres = movie.genres.slice(0, 2).join(", ");
                const genreElements = slide.querySelectorAll(".genre");
                genreElements.forEach((genreElement, idx) => {
                    genreElement.textContent = idx < 2 ? genres.split(", ")[idx] : "";
                });

                slide.querySelector(".slide-description").textContent = movie.overview;

                // Example placeholder image
                slide.querySelector("img").src = "";   
            }
        })

        movieIds = movies.map(movie => movie.id);
        // console.log("Movie IDs for next function:", movieIds);

        getAllMovieDetails().then(() => {
            initializeHoverEffect();
        });

    } catch (error) {
        console.error("Error:", error.message);
    }
}


//2ND API CALL for top 10

const apiKey = "bb40bba9ec0647c0d0b72356663d2967";
// const movieIds = [138843, 280092, 155, 1726, 8966, 9502, 53182, 238636, 9360, 157336]; 
// const movieIds = [99861, 140607, 135397, 27205, 138843, 280092, 9502, 1359, 42246, 211672]; 
// Replace with your movie IDs
const movieDetails = [];

// Function to fetch movie details
async function fetchMovieDetails(movieId) {
    const url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch data for movie ID: ${movieId}`);
        }
        const data = await response.json();
        return {
            id: movieId,
            vote_average: data.vote_average,
            backdrop_path: `https://image.tmdb.org/t/p/original${data.backdrop_path}`,
            poster_path: `https://image.tmdb.org/t/p/original${data.poster_path}`
        };
    } catch (error) {
        console.error(error.message);
        return null; // Return null for failed fetch
    }
}

// Fetch details for all movies
async function getAllMovieDetails() {
    try {
        const fetchPromises = movieIds.map(movieId => fetchMovieDetails(movieId));
        const results = await Promise.all(fetchPromises);

        // Filter out any null results and push to movieDetails
        results.forEach(result => {
            if (result) {
                movieDetails.push(result);
            }
        });

        // console.log("Movie Details:", movieDetails);

        const carouselContainer = document.querySelector(".carousel-container");

        carouselContainer.innerHTML = ""

        // Example: Use the data (e.g., render on a page)
        movieDetails.forEach((movie,index) => {
            const movieCard = document.createElement("div");
            movieCard.classList.add("movieCard");
            movieCard.setAttribute("data-image", movie.backdrop_path);

            movieCard.innerHTML = 
            `
            <img src="${movie.poster_path}" alt="Movie 1">
            <div class="ranking">${index + 1}</div>
            <div class="action-icons">
                <!-- Watch Later Icon with Hover Text -->
                <div class="action-icon">
                    <i class="fas fa-clock"></i>
                    <span class="hover-text">Watch Later</span>
                </div>
                    
                <!-- Already Watched Icon with Hover Text -->
                <div class="action-icon">
                    <i class="fas fa-check"></i>
                    <span class="hover-text">Already Watched</span>
                </div>
                    
                <!-- Interested Icon with Hover Text -->
                <div class="action-icon">
                    <i class="fas fa-heart"></i>
                    <span class="hover-text">Interested</span>
                </div>
            </div>
            `

            carouselContainer.appendChild(movieCard);
        });
        // console.log("Movie details have been updated in the DOM.");
        updateCarousel();
        updateMovieImages();
    } catch (error) {
        console.error("Error fetching movie details:", error);
    }
}

function updateMovieImages() {
    const slides = document.querySelectorAll(".slide");

    movieDetails.forEach((movieDetail, index) => {
        const slide = slides[index];
        if (slide) {
            const imgElement = slide.querySelector("img");
            if (imgElement) {
                // Set the backdrop image from movieDetails
                imgElement.src = movieDetail.backdrop_path;
            }
        }
    });
}

getMoviesInitial();

// Run the function


//--------------------------------------------------------------------------------------------


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
    const movieCards = document.querySelectorAll(".movieCard"); // Query the movie cards dynamically
    if (movieCards.length === 0) return; // Exit if no movie cards

    const cardWidth = movieCards[0].offsetWidth + 20; // Include gap between cards
    const maxScrollPosition = (movieCards.length * cardWidth) - carousel.offsetWidth;

    // Add click event for the right arrow
    arrowRight.addEventListener("click", () => {
        if (currentPosition < maxScrollPosition) {
            currentPosition += cardWidth;
            carousel.style.transform = `translateX(-${currentPosition}px)`;
        }
    });

    // Add click event for the left arrow
    arrowLeft.addEventListener("click", () => {
        if (currentPosition > 0) {
            currentPosition -= cardWidth;
            carousel.style.transform = `translateX(-${currentPosition}px)`;
        }
    });

    // console.log("Carousel initialized. Max Scroll Position:", maxScrollPosition);
}

// Recalculate values on window resize
window.addEventListener("resize", () => {
    currentPosition = 0; // Reset position
    carousel.style.transform = "translateX(0px)"; // Reset transform
    updateCarousel(); // Recalculate values
});

// Initialize carousel
// updateCarousel();

// Background Image updater

// Get all movie cards
// const movieCards = document.querySelectorAll('.movieCard');

// Listen for hover event on each movie card
// Background Image updater

// Dynamically fetch the movie cards after they are rendered
function initializeHoverEffect() {
    const movieCards = document.querySelectorAll(".movieCard");
    const mainElement = document.querySelector("main");

    // Ensure movie cards exist
    if (!movieCards || movieCards.length === 0) {
        console.error("No movie cards found.");
        return;
    }

    // Listen for hover event on each movie card
    movieCards.forEach((card) => {
        card.addEventListener("mouseenter", function () {
            // Get the custom image URL stored in the data-image attribute
            const customImage = card.getAttribute("data-image");
            if (customImage) {
                // Set the background image for the ::before pseudo-element
                mainElement.style.setProperty("--background-image", `url(${customImage})`);
                mainElement.classList.add("active");
            }
        });

        card.addEventListener("mouseleave", function () {
            // Remove the background image when hover ends
            mainElement.classList.remove("active");
        });
    });
}

// Call the function after dynamically loading the movie cards



//Footer Animation
document.addEventListener('DOMContentLoaded', () => {
    const footer = document.querySelector('.footer');
    const footerLogo = document.querySelector('.footer-logo');
    const footerDescription = document.querySelector('.footer-description');
    const footerSections = document.querySelector('.footer-sections');
    const footerLinks = document.querySelectorAll('.footer-links');
    const footerSocial = document.querySelector('.footer-social');
    const footerCopyright = document.querySelector('.footer-copyright');

    // Create an intersection observer to detect when the footer is in view
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // If footer is in view, trigger animations
                footer.style.opacity = 1;
                footer.style.transform = 'translateY(0)';
                footerLogo.style.opacity = 1;
                footerLogo.style.transform = 'translateY(0)';
                footerDescription.style.opacity = 1;
                footerDescription.style.transform = 'translateY(0)';
                footerSections.style.opacity = 1;
                footerSections.style.transform = 'translateY(0)';
                footerSocial.style.opacity = 1;
                footerSocial.style.transform = 'translateY(0)';
                footerCopyright.style.opacity = 1;
                footerCopyright.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.2 // Trigger when 20% of the footer is visible
    });

    // Observe the footer element
    observer.observe(footer);
});

//Logout Button

// Toggle the dropdown visibility
document.querySelector('.profile-icon').addEventListener('click', function () {
    const dropdown = document.querySelector('.profile-dropdown');
    dropdown.classList.toggle('show');
});

// Hide the dropdown when clicking outside
document.addEventListener('click', function (event) {
    const dropdown = document.querySelector('.profile-dropdown');
    if (!dropdown.contains(event.target)) {
        dropdown.classList.remove('show');
    }
});




