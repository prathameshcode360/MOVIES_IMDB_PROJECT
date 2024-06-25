const movieSearchBox = document.getElementById("movie-search-box");
const searchList = document.getElementById("search-list");
const resultGrid = document.getElementById("result-grid");

// Load movies from API
async function loadMovies(searchTerm) {
  const URL = `https://omdbapi.com/?s=${searchTerm}&page=1&apikey=fc1fef96`;
  const res = await fetch(`${URL}`);
  const data = await res.json();
  if (data.Response == "True") displayMovieList(data.Search);
}

function findMovies() {
  let searchTerm = movieSearchBox.value.trim();
  if (searchTerm.length > 0) {
    searchList.classList.remove("hide-search-list");
    loadMovies(searchTerm);
  } else {
    searchList.classList.add("hide-search-list");
  }
}

function displayMovieList(movies) {
  searchList.innerHTML = "";
  for (let idx = 0; idx < movies.length; idx++) {
    let movieListItem = document.createElement("div");
    movieListItem.dataset.id = movies[idx].imdbID;
    movieListItem.classList.add("search-list-item");
    let moviePoster =
      movies[idx].Poster != "N/A" ? movies[idx].Poster : "image_not_found.png";

    movieListItem.innerHTML = `
        <div class="search-item-thumbnail">
            <img src="${moviePoster}">
        </div>
        <div class="search-item-info">
            <h3>${movies[idx].Title}</h3>
            <p>${movies[idx].Year}</p>
        </div>
        `;
    searchList.appendChild(movieListItem);
  }
  loadMovieDetails();
}

function loadMovieDetails() {
  const searchListMovies = searchList.querySelectorAll(".search-list-item");
  searchListMovies.forEach((movie) => {
    movie.addEventListener("click", () => {
      const movieID = movie.dataset.id;
      window.location.href = `moviePage.html?id=${movieID}`;
    });
  });
}

async function loadMovieDetailsById(id) {
  const result = await fetch(
    `https://www.omdbapi.com/?i=${id}&apikey=fc1fef96`
  );
  const movieDetails = await result.json();
  displayMovieDetails(movieDetails);
}

function displayMovieDetails(details) {
  resultGrid.innerHTML = `
    <div class="movie-poster">
        <img src="${
          details.Poster != "N/A" ? details.Poster : "image_not_found.png"
        }" alt="movie poster">
    </div>
    <div class="movie-info">
        <h3 class="movie-title">${details.Title}</h3>
        <ul class="movie-misc-info">
            <li class="year">Year: ${details.Year}</li>
            <li class="rated">Ratings: ${details.Rated}</li>
            <li class="released">Released: ${details.Released}</li>
        </ul>
        <p class="genre"><b>Genre:</b> ${details.Genre}</p>
        <p class="writer"><b>Writer:</b> ${details.Writer}</p>
        <p class="actors"><b>Actors: </b>${details.Actors}</p>
        <p class="plot"><b>Plot:</b> ${details.Plot}</p>
        <p class="language"><b>Language:</b> ${details.Language}</p>
        <p class="awards"><b><i class="fas fa-award"></i></b> ${
          details.Awards
        }</p>
    </div>
    `;

  const addToFavoritesButton = document.getElementById(
    "add-to-favorites-button"
  );
  addToFavoritesButton.onclick = () => addToFavorites(details.imdbID);
}

// Favorites functionality
function addToFavorites(imdbID) {
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  if (!favorites.includes(imdbID)) {
    favorites.push(imdbID);
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }
}

function loadFavorites() {
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  const favoritesList = document.getElementById("favorites-list");
  favoritesList.innerHTML = "";
  favorites.forEach((id) => {
    fetch(`https://www.omdbapi.com/?i=${id}&apikey=fc1fef96`)
      .then((res) => res.json())
      .then((movie) => {
        let movieItem = document.createElement("div");
        movieItem.classList.add("favorite-movie-item");
        movieItem.innerHTML = `
                <div class="favorite-movie-thumbnail">
                    <img src="${
                      movie.Poster != "N/A"
                        ? movie.Poster
                        : "image_not_found.png"
                    }">
                </div>
                <div class="favorite-movie-info">
                    <h3>${movie.Title}</h3>
                    <p>${movie.Year}</p>
                    <button class="btn btn-danger" onclick="removeFromFavorites('${
                      movie.imdbID
                    }')">Remove</button>
                </div>
                `;
        favoritesList.appendChild(movieItem);
      });
  });
}

function removeFromFavorites(imdbID) {
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  favorites = favorites.filter((id) => id !== imdbID);
  localStorage.setItem("favorites", JSON.stringify(favorites));
  loadFavorites();
}
