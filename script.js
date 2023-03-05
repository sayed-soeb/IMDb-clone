"use strict";
(function () {
  const searchKeyword = document.getElementById("search-input");
  const suggestionsContainer = document.getElementById("movies-grid");
  const favMoviesContainer = document.getElementById("favourite");

  //array to maintain data for displaying content on the webpage
  let favMovieArray = [];
  let suggestionList = [];

  //functioncall to maintain favourite container
  addToFavDOM();
  searchKeyword.addEventListener("keydown", (event) => {
    if (event.key == "Enter") {
      event.preventDefault();
    }
  });

  // Event listner on search to get input
  searchKeyword.addEventListener("keyup", function () {
    let search = searchKeyword.value;
    if (search === "") {
      suggestionsContainer.innerHTML = "";
       // clears the previous movies from array
      suggestionList = [];
    } 
    else {
      (async () => {
        let data = await fetchMovies(search);
        addToSuggestionContainerDOM(data);
      })();

      suggestionsContainer.style.display = "grid";
    }
  });

  // Fetches data from api
  async function fetchMovies(search) {
    const url = `https://www.omdbapi.com/?t=${search}&apikey=ac65eceb`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      return data;
    } catch (err) {
      console.log(err);
    }
  }

  //This function is used to Shows in suggestion container
  function addToSuggestionContainerDOM(data) {
    let isPresent = false;

    // to check if the movie is already present in the suggestionList array
    suggestionList.forEach((movie) => {
      if (movie.Title == data.Title) {
        isPresent = true;
      }
    });

    if (!isPresent && data.Title != undefined) {
      if (data.Poster == "N/A") {
        data.Poster = "./images_not_found.png";
      }
      suggestionList.push(data);
      const movieCard = document.createElement("div");
      movieCard.setAttribute("class", "text-decoration");

      movieCard.innerHTML = `
        <div class="movie-card" data-id = " ${data.Title} ">
        <button>
          <img
            src="${data.Poster} "
            class="card-img-top"
            alt="..."
            data-id = "${data.Title} "
          />
          </button>
            <p>
              <i>⭐${data.imdbRating}</i>
              <button class="fav-btn">
                <i class="fa-solid fa-heart add-fav" data-id="${data.Title}"></i>
              </button>
            <a href="movie.html" class="movie-nam" data-id="${data.Title}"><h1>${data.Title}</h1></a>
            </p>
      </div>
    `;
      suggestionsContainer.prepend(movieCard);
    }
  }

//function to add movie data to localstorage
function addFav(data){
let favMoviesLocal = localStorage.getItem("favMoviesList");
if (favMoviesLocal) {
  favMovieArray = Array.from(JSON.parse(favMoviesLocal));
} else {
  localStorage.setItem("favMoviesList", JSON.stringify(data));
}

// to check if movie is already present in the fav list
let isPresent = false;
favMovieArray.forEach((movie) => {
if (data.Title == movie.Title) {
  window.alert("already added to fav list");
  isPresent = true;
}
});

if (!isPresent) {
favMovieArray.push(data);
localStorage.setItem("favMoviesList", JSON.stringify(favMovieArray));
isPresent = !isPresent;
addToFavDOM();
}
}
// Add to favourite list DOM
function addToFavDOM() {
favMoviesContainer.innerHTML = "";
let favList = JSON.parse(localStorage.getItem("favMoviesList"));
if (favList) {
  favList.forEach((movie) => {
    console.log(movie.Title);
    if(movie.Title !=undefined){
    const div = document.createElement("div");
    div.innerHTML = `
<div class="fav-div">
<img src="${movie.Poster}" class="fav-movie-poster"/>
<div class="movie-card-details">
  <p class="movie-name">
   <a href="movie.html" class="fav-movie-name" data-id="${movie.Title}">${movie.Title}</a> 
  </p>
</div>
<div class="delete-btn">
   <i class="fa-solid fa-trash-can" data-id="${movie.Title}"></i>
</div>
</div>
`;
    //it will add movies to favourite section
    favMoviesContainer.prepend(div);
}});
}
}

async function handleFavBtn(e) {
  const target = e.target;

  let data = await fetchMovies(target.dataset.id);
  addFav(data);
}

//funcion to delete movies from favourite list
function deleteBtn(movieName) {
  let favList = JSON.parse(localStorage.getItem("favMoviesList"));
  let updatedList = Array.from(favList).filter((movie) => {
    return movie.Title != movieName;
  });

  localStorage.setItem("favMoviesList", JSON.stringify(updatedList));

  addToFavDOM();
}

async function handleClickListner(e) {
  const target = e.target;
  if (target.classList.contains("add-fav")) {
    e.preventDefault();
    handleFavBtn(e);
  }
  else if (target.classList.contains("fa-trash-can")) {
    deleteBtn(target.dataset.id);
  } 
//it will maintain localdata of movie title that is used by info.js file
  localStorage.setItem("movieName", target.dataset.id);
}

//event listener for click function
document.addEventListener("click", handleClickListner);
})();