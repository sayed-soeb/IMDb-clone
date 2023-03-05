const resultGrid = document.getElementById('movies-grid');
//it will get movie data from localstorage
const data=localStorage.getItem("movieName")

//following function will display movie info
displayMovieDetails(data);
async function displayMovieDetails(data){
    const url = `https://www.omdbapi.com/?t=${data}&type=movie&apikey=ac65eceb`;
    try {
      const response = await fetch(url);
      const details = await response.json();
    resultGrid.innerHTML = `
    <div class = "movie-poster">
        <img src = "${details.Poster}">
    </div>
    <div class = "movie-info">
        <h3 class = "movie-title">${details.Title}</h3>
        <ul class = "movie-misc-info">
            <li class = "year">Year: ${details.Year}</li>
            <li class = "rated">Ratings: ${details.Rated}</li>
            <li class = "released">Released: ${details.Released}</li>
        </ul>
        <p class = "genre"><b>Genre:</b> ${details.Genre}</p>
        <p class = "writer"><b>Writer:</b> ${details.Writer}</p>
        <p class = "actors"><b>Actors: </b>${details.Actors}</p>
        <p class = "plot"><b>Plot:</b> ${details.Plot}</p>
        <p class = "language"><b>Language:</b> ${details.Language}</p>
        <p class = "awards"><b><i class = "fas fa-award"></i></b> ${details.Awards}</p>
    </div>
    `;
}
catch (err) {
    console.log(err);
  }
}