/**
 * Script principal pour la recherche et l'affichage des films via l'API OMDB
 * Par Pierre Tremblay, Adrien Pinheiro et Julien Picquet
 * 2022 - Diginamic
 */

// Déclaration des constantes et variables principales
const API_KEY = "21a60aa1";
const ERROR_MESSAGE = "Aucun film n'a été trouvé";
const MINIMUM_SEARCH_LENGTH = 3;
const MINIMUM_SEARCH_ERROR = `Veuillez saisir au moins ${MINIMUM_SEARCH_LENGTH} caractères`;
const FULL_SYNOPSIS = "full";
const SHORT_SYNOPSIS = "short";
const input = document.querySelector("#inputSearch");
const listMovies = document.querySelector("#listMovies");
const container = document.querySelector(".container");

let i = 1;
let lengthSynopsis = FULL_SYNOPSIS;
let total;
let filtre = "";

/**
 * @description Permet de charger les films
 * @param  {String} searchValue
 */
async function loadMovies(searchValue, searchPage = i, filter = filtre) {
    const URL = `https://omdbapi.com/?s=${searchValue}&page=${searchPage}&plot=${lengthSynopsis}&type=${filter}&apikey=${API_KEY}`;
    const response = await fetch(`${URL}`);
    const data = await response
        .json()
        .catch((error) => {
            console.log(error);
        });
    total = data;
    data.Response == "True"
        ? showListMovies(data.Search)
        : (listMovies.innerHTML = `<p class="totalMovies">${ERROR_MESSAGE}</p>`);
}

/**
 * @description Permet de récupérer les films selon la recherche
 */
function findMovies() {
    i = 1;
    let search = input
        .value
        .trim();
    let select = document.querySelector("select");
    let divError = document.querySelector(".totalMovies");
    filtre = select.value;
    if (search.length >= MINIMUM_SEARCH_LENGTH) {
        loadMovies(search);
        sessionStorage.setItem("search", search);
    } else if (search.length < MINIMUM_SEARCH_LENGTH && search.length >= 1 && !divError) {
        let minFont = document.createElement("div");
        minFont
            .classList
            .add("totalMovies");
        minFont.innerHTML = `
      <p>${MINIMUM_SEARCH_ERROR}</p>
    `;
        listMovies.appendChild(minFont);
    }
}

/**
 * @description Permet d'afficher la liste des 10 films
 * @param  {Array} movies
 */
function showListMovies(movies) {
    if (i == 1) {
        listMovies.innerHTML = "";
        let maxMovies = document.createElement("div");
        maxMovies
            .classList
            .add("totalMovies");
        maxMovies.innerHTML = `
      <p>Il y a ${total.totalResults} résultats trouvés</p>
    `;
        listMovies.appendChild(maxMovies);
    }
    movies.map((movie) => {
        let movieListItem = document.createElement("div");
        movieListItem
            .classList
            .add("movieListItem");
        movieListItem.dataset.id = movie.imdbID;
        movieListItem.innerHTML = `
        <div class="cardMovieImg">
            <img src= "${
        movie.Poster != "N/A"
            ? movie.Poster
            : "./img/notavailable.png"}">
            ${(movie.Type == "series") ? `<div class="movieSerie">Série</div>` : ''}
            ${(movie.Type == "movie") ? `<div class="movieFilm">Film</div>` : ''}
            ${(movie.Type == "episode") ? `<div class="movieShowTV">Show TV</div>` : ''}
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
        movie.addEventListener("click", async() => {
            input.value = "";
            listMovies.innerHTML = "";
            const result = await fetch(`https://www.omdbapi.com/?i=${movie.dataset.id}&apikey=${API_KEY}`);
            const movieDetails = await result.json();
            showMovieDetails(movieDetails);
            i = 1;
        });
    });
}
/**
 * @description Permet d'afficher les détails d'un film
 * @param  {JSON} details
 */
function showMovieDetails(details) {
    listMovies.innerHTML = `
    <div class="btnAlign">
      <div class="btnReturn">
        <button id="btnReturnToResult">
          <- Retourner à mes résultats
        </button>
      </div>
    </div>
    <div class="cardMovie">
        <div class="cardMovieImg">
            <img src = "${
    details.Poster != "N/A"
        ? details.Poster
        : "./img/notavailable.png"}">
        </div>
        <div class="cardMovieDescription">
            <h3>${
    details.Title != "N/A"
        ? details.Title
        : "Aucune information trouvée"}</h3>
            <ul>
                <li>Année : ${
    details.Year != "N/A"
        ? details.Year
        : "Aucune information trouvée"}</li>
                <li>Sortie : ${
    details.Released != "N/A"
        ? details.Released
        : "Aucune information trouvée"}</li>
                <li>Âge minimum recommandé : ${
    details.Rated != "N/A"
        ? details.Rated
        : "Aucune information trouvée"}</li>
            </ul>
            <p><b>Genre :</b> ${
    details.Genre != "N/A"
        ? details.Genre
        : "Aucune information trouvée"}</p>
            <p><b>Auteurs :</b> ${
    details.Writer != "N/A"
        ? details.Writer
        : "Aucune information trouvée"}</p>
            <p><b>Acteurs : </b>${
    details.Actors != "N/A"
        ? details.Actors
        : "Aucune information trouvée"}</p>
            <p><b>Synopsis :</b> ${
    details.Plot != "N/A"
        ? details.Plot
        : "Aucune information trouvée"}</p>
            <p><b>Langues :</b> ${
    details.Language != "N/A"
        ? details.Language
        : "Aucune information trouvée"}</p>
            <p><b>Récompenses :</b> ${
    details.Awards != "N/A"
        ? details.Awards
        : "Aucune information trouvée"}</p>
        </div>
    </div>
    `;
    returnResults();
}
/**
 * @description Permet de créer un scroll infini qui ira fetch les films suivants lorsqu'on scroll
 * @param  {Event} event
 */
function LazyLoading(e) {
    e.preventDefault();
    const cardMovie = document.querySelector(".cardMovie");
    const movieListItem = document.querySelector(".movieListItem");
    const {scrollTop, scrollHeight, clientHeight} = document.documentElement;
    if (clientHeight + scrollTop >= scrollHeight && !cardMovie && movieListItem) {
        i++;
        if (i < total.totalResults / 10) {
            loadMovies(input.value, i);
        }
    }
}

window.addEventListener("scroll", (e) => LazyLoading(e));
function returnResults() {
    let btn = document.querySelector("#btnReturnToResult");
    let search = sessionStorage.getItem("search");
    btn.addEventListener("click", () => {
        input.value = search;
        loadMovies(search);
    });
}
