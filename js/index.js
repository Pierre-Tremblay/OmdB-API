/**
 * Script principal pour la recherche et l'affichage des films via l'API OMDB
 * Par Pierre Tremblay, Adrien Pinheiro et Julien Picquet
 * 2022 - Diginamic
 */

// Déclaration des constantes et variables principales
const API_KEY = "546d65c4";
const ERROR_MESSAGE = "Aucun film n'a été trouvé";
const MINIMUM_SEARCH_LENGTH = 3;
const MINIMUM_SEARCH_ERROR = "Veuillez saisir au moins 3 caractères";
const FULL_SYNOPSIS = "full";
const SHORT_SYNOPSIS = "short";
const input = document.querySelector("#inputSearch");
const listMovies = document.querySelector("#listMovies");

let searchPage = 1;
let lengthSynopsis = FULL_SYNOPSIS;

/**
 * @description Permet de charger les films
 * @param  {String} searchValue
 */
async function loadMovies(searchValue) {
  const URL = `https://omdbapi.com/?s=${searchValue}&page=${searchPage}&plot=${lengthSynopsis}&apikey=${API_KEY}`;
  const response = await fetch(`${URL}`);
  const data = await response.json().catch((error) => {
    console.log(error);
  });
  console.log(data);
  data.Response == "True"
    ? showListMovies(data.Search)
    : (listMovies.innerHTML = `<p>${ERROR_MESSAGE}</p>`);
    
}

/**
 * @description Permet de récupérer les films selon la recherche
 */
function findMovies() {
  let search = input.value.trim();
  search.length >= MINIMUM_SEARCH_LENGTH
    ? loadMovies(search)
    : console.log(MINIMUM_SEARCH_ERROR);
}

/**
 * @description Permet d'afficher la liste des 10 films
 * @param  {Array} movies
 */
function showListMovies(movies) {
  listMovies.innerHTML = "";
  movies.map((movie) => {
    let movieListItem = document.createElement("div");
    movieListItem.classList.add("movieListItem");
    movieListItem.dataset.id = movie.imdbID;
    movieListItem.innerHTML = `
        <div class="cardMovieImg">
            <img src= "${
              movie.Poster != "N/A" ? movie.Poster : "./img/notavailable.png"
            }">
        </div>
        <div class="movieListItemInfos">
            <h1>${movie.Title}</h1>
            <p>${movie.Year}</p>
        </div>
        `;
    listMovies.appendChild(movieListItem);
  });

  loadOneMovie();
}
/**
 * @description Permet de charger un film selon son ID
 */
function loadOneMovie() {
  const searchListMovies = listMovies.querySelectorAll(".movieListItem");
  searchListMovies.forEach((movie) => {
    movie.addEventListener("click", async () => {
      input.value = "";
      listMovies.innerHTML = "";
      const result = await fetch(
        `http://www.omdbapi.com/?i=${movie.dataset.id}&apikey=${API_KEY}`
      );
      const movieDetails = await result.json();
      showMovieDetails(movieDetails);
    });
  });
}
/**
 * @description Permet d'afficher les détails d'un film
 * @param  {JSON} details
 */
function showMovieDetails(details) {
  listMovies.innerHTML = `
    <div class="cardMovie">
        <div class="cardMovieImg">
            <img src = "${
              details.Poster != "N/A"
                ? details.Poster
                : "./img/notavailable.png"
            }">
        </div>
        <div class="cardMovieDescription">
            <h3>${
              details.Title != "N/A"
                ? details.Title
                : "Aucune information trouvée"
            }</h3>
            <ul>
                <li>Année : ${
                  details.Year != "N/A"
                    ? details.Year
                    : "Aucune information trouvée"
                }</li>
                <li>Notes : ${
                  details.Rated != "N/A"
                    ? details.Rated
                    : "Aucune information trouvée"
                }</li>
                <li>Sortie : ${
                  details.Released != "N/A"
                    ? details.Released
                    : "Aucune information trouvée"
                }</li>
            </ul>
            <p><b>Genre :</b> ${
              details.Genre != "N/A"
                ? details.Genre
                : "Aucune information trouvée"
            }</p>
            <p><b>Auteurs :</b> ${
              details.Writer != "N/A"
                ? details.Writer
                : "Aucune information trouvée"
            }</p>
            <p><b>Acteurs : </b>${
              details.Actors != "N/A"
                ? details.Actors
                : "Aucune information trouvée"
            }</p>
            <p><b>Synopsis :</b> ${
              details.Plot != "N/A"
                ? details.Plot
                : "Aucune information trouvée"
            }</p>
            <p><b>Langues :</b> ${
              details.Language != "N/A"
                ? details.Language
                : "Aucune information trouvée"
            }</p>
            <p><b>Récompenses :</b> ${
              details.Awards != "N/A"
                ? details.Awards
                : "Aucune information trouvée"
            }</p>
        </div>
    </div>
    `;
    
}
