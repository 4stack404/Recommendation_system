const searchInput = document.getElementById("movie-search");
const suggestionsList = document.getElementById("suggestions");
const selectedMoviesList = document.getElementById("selected-movies-list");
const submitBtn = document.getElementById("submit-btn");

let movies = [];
let selectedMovies = [];

// Fetch movies from dataset.json
fetch("../Data/dataset.json")
    .then(response => {
        if (!response.ok) {
            throw new Error("Failed to load dataset.json");
        }
        return response.json();
    })
    .then(data => {
        movies = data; // Store the movies in a global variable
    })
    .catch(error => {
        console.error("Error loading movies:", error);
    });

// Search movies and update suggestions dropdown
searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase();
    suggestionsList.innerHTML = "";

    if (query) {
        const suggestions = movies.filter(movie =>
            movie.original_title.toLowerCase().includes(query)
        );

        suggestions.forEach(movie => {
            const li = document.createElement("li");
            li.textContent = movie.original_title;
            li.dataset.id = movie.id;
            suggestionsList.appendChild(li);
        });
    }
});

// Add movie to selected list
suggestionsList.addEventListener("click", (e) => {
    if (e.target.tagName === "LI") {
        const movieId = e.target.dataset.id;
        const movieTitle = e.target.textContent;

        // Ensure no duplicates and max 5 movies
        if (selectedMovies.length < 5 && !selectedMovies.find(m => m.id == movieId)) {
            selectedMovies.push({ id: movieId, original_title: movieTitle });
            updateSelectedMovies();
        }

        // Clear search input and suggestions
        searchInput.value = "";
        suggestionsList.innerHTML = "";
    }
});

// Update the selected movies list in the DOM
function updateSelectedMovies() {
    selectedMoviesList.innerHTML = "";
    selectedMovies.forEach((movie, index) => {
        const li = document.createElement("li");
        li.textContent = movie.original_title;

        // Add remove button to each selected movie
        const removeBtn = document.createElement("button");
        removeBtn.textContent = "Remove";
        removeBtn.classList.add("remove-btn");
        removeBtn.dataset.index = index;

        li.appendChild(removeBtn);
        selectedMoviesList.appendChild(li);
    });

    // Update the header for selected movies
    const header = document.querySelector("#selected-movies h2");
    header.textContent = `Selected Movies (${selectedMovies.length}/5)`;

    // Enable/disable submit button based on selected movies
    submitBtn.disabled = selectedMovies.length === 0;
}

// Remove a movie from the selected list
selectedMoviesList.addEventListener("click", (e) => {
    if (e.target.tagName === "BUTTON" && e.target.classList.contains("remove-btn")) {
        const index = e.target.dataset.index;
        selectedMovies.splice(index, 1); // Remove the selected movie
        updateSelectedMovies();
    }
});

// Store selected movies in localStorage and redirect
submitBtn.addEventListener("click", () => {
    localStorage.setItem("selectedMovies", JSON.stringify(selectedMovies));
    window.location.href = "home.html"; // Redirect to main page
});
