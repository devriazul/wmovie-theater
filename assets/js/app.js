// API Request

const API_KEY = "api_key=4ea2104843aab694c9b5c3e5d8504b7f";
const BASE_URL = "https://api.themoviedb.org/3";
const API_URL = BASE_URL + "/discover/movie?" + API_KEY;
const IMG_URL = "https://image.tmdb.org/t/p/w500";
const SEARCH_URL = BASE_URL + "/search/movie?" + API_KEY + "&query=";

const genre = [
  {
    id: 28,
    name: "Action",
  },
  {
    id: 12,
    name: "Adventure",
  },
  {
    id: 16,
    name: "Animation",
  },
  {
    id: 35,
    name: "Comedy",
  },
  {
    id: 80,
    name: "Crime",
  },
  {
    id: 99,
    name: "Documentary",
  },
  {
    id: 18,
    name: "Drama",
  },
  {
    id: 10751,
    name: "Family",
  },
  {
    id: 14,
    name: "Fantasy",
  },
  {
    id: 36,
    name: "History",
  },
  {
    id: 27,
    name: "Horror",
  },
  {
    id: 10402,
    name: "Music",
  },
  {
    id: 9648,
    name: "Mystery",
  },
  {
    id: 10749,
    name: "Romance",
  },
  {
    id: 878,
    name: "Science Fiction",
  },
  {
    id: 10770,
    name: "TV Movie",
  },
  {
    id: 53,
    name: "Thriller",
  },
  {
    id: 10752,
    name: "War",
  },
  {
    id: 37,
    name: "Western",
  },
];

// JavaScript Selectors
const movieArea = document.querySelector(".movie__area");
const form = document.querySelector(".form");
const search = document.getElementById("search");
const filter = document.querySelector(".filter");
const prev = document.getElementById("prev");
const current = document.getElementById("current");
const next = document.getElementById("next");
let currentPage = 1;
let nextPage = 2;
let prevPage = 3;
let lastUrl = "";
let totalPage = 4;

getMovies(API_URL);
function getMovies(url) {
  lastUrl = url;
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      const results = data.results;

      if (results.length !== 0) {
        showMovie(results);
        currentPage = data.page;
        nextPage = currentPage + 1;
        prevPage = currentPage - 1;
        totalPage = data.total_pages;
        current.innerText = currentPage;
        if (currentPage <= 1) {
          prev.classList.add("pagination__page--disabled");
          next.classList.remove("ppagination__page--disabled");
        } else if (currentPage >= totalPage) {
          prev.classList.remove("pagination__page--disabled");
          next.classList.add("pagination__page--disabled");
        } else {
          prev.classList.remove("pagination__page--disabled");
          next.classList.remove("pagination__page--disabled");
        }
      } else {
        movieArea.innerHTML = `<div class="error"><div class=error__content><img src="https://web.abijita.com/wp-content/uploads/2018/02/404-Error.png"></div></div>`;
      }
    });
}

//  Eventlistener

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const searchValue = search.value.trim();
  selectedGenre = [];
  setGenre();
  if (searchValue && searchValue !== "") {
    getMovies(SEARCH_URL + searchValue);
    search.value = "";
  } else {
    window.location.reload();
  }
});

next.addEventListener("click", () => {
  if (nextPage <= totalPage) {
    pageCall(nextPage);
  }
});
prev.addEventListener("click", () => {
  if (prevPage > 0) {
    pageCall(prevPage);
  }
});

// function for Pagination

let pageCall = (page) => {
  let urlSplit = lastUrl.split("?");
  let queryParam = urlSplit[1].split("&");
  let key = queryParam[queryParam.length - 1].split("=");
  if (key[0] != "page") {
    let url = lastUrl + "&page=" + page;
    getMovies(url);
  } else {
    key[1] = page.toString();
    let a = key.join("=");
    queryParam[queryParam.length - 1] = a;
    let b = queryParam.join("&");
    let url = urlSplit[0] + "?" + b;
    getMovies(url);
  }
};

// Render Movie

let showMovie = (results) => {
  movieArea.innerHTML = "";
  results.forEach((movie) => {
    console.log(movie);
    const { title, poster_path, vote_average, overview, id, release_date } =
      movie;
    //const year = release_date.split("-").slice(0, 1)[0];

    const movieEl = document.createElement("div");
    movieEl.classList.add("movie");
    movieEl.innerHTML = `
            <img src="${
              poster_path
                ? IMG_URL + poster_path
                : "https://aimint.org/ap/wp-content/uploads/sites/18/2016/04/image-placeholder-vertical.jpg"
            }"
            alt="${title}">
            <div class="movie__info">
                 <h3 class="movie__title">${title}</h3>
                <span class="${getColor(vote_average)}">${vote_average}</span>
                <p class="year">${release_date.split("-").slice(0, 1)[0]}</p>
            </div>
            <div class="overview">
                <h4>Overview</h4>
                  <p>${overview}</p>
                <button id="${id}" class="btn" type="button">Show Trailer</button>
            </div>`;
    movieArea.appendChild(movieEl);

    document.getElementById(id).addEventListener("click", () => {
      openNav(movie);
    });
  });
};

/* Open when someone clicks on the span element */
const overlayVideo = document.getElementById("overlay-video");
function openNav(movie) {
  let id = movie.id;
  fetch(BASE_URL + "/movie/" + id + "/videos?" + API_KEY)
    .then((res) => res.json())
    .then((videoData) => {
      if (videoData) {
        document.getElementById("myNav").style.width = "100%";
        if (videoData.results.length > 0) {
          let embed = [];

          videoData.results.forEach((video) => {
            let { name, key, site } = video;
            if (site == "YouTube") {
              embed.push(`
              <iframe width="800" height="500" src="https://www.youtube.com/embed/${key}" title="${name}" class='embed hide' frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>            
              
              `);
            }
          });

          overlayVideo.innerHTML = embed.join(" ");
          activeVideo = 0;
          showVideos();
        } else {
          overlayVideo.innerHTML = `<div class="error"><div class=error__content><img src="https://web.abijita.com/wp-content/uploads/2018/02/404-Error.png"></div></div>`;
        }
      }
    });
}

/* Close when someone clicks on the "x" symbol inside the overlay */
function closeNav() {
  document.getElementById("myNav").style.width = "0%";
}

// Video render function

let activeVideo = 0;
function showVideos() {
  let embedClasses = document.querySelectorAll(".embed");
  embedClasses.forEach((embedTag, idx) => {
    if (activeVideo == idx) {
      embedTag.classList.add("show");
      embedTag.classList.remove("hide");
    } else {
      embedTag.classList.add("hide");
      embedTag.classList.remove("show");
    }
  });
}
// Color function

let getColor = (vote) => {
  if (vote >= 8) {
    return "green";
  } else if (vote >= 5) {
    return "orange";
  } else {
    return "red";
  }
};

//  Filter function

let selectedGenre = [];
let setGenre = () => {
  filter.innerHTML = "";
  genre.forEach((genre) => {
    const filterDiv = document.createElement("div");
    filterDiv.classList.add("filter__element");
    filterDiv.id = genre.id;
    filterDiv.innerText = genre.name;
    filterDiv.addEventListener("click", () => {
      if (selectedGenre.length == 0) {
        selectedGenre.push(genre.id);
      } else {
        if (selectedGenre.includes(genre.id)) {
          selectedGenre.forEach((Id, Index) => {
            if (Id == genre.id) {
              selectedGenre.splice(Index, 1);
            }
          });
        } else {
          selectedGenre.push(genre.id);
        }
      }
      console.log(selectedGenre);
      getMovies(API_URL + "&with_genres=" + encodeURI(selectedGenre.join(",")));
      highlightSelection();
    });
    filter.appendChild(filterDiv);
  });
};
setGenre();

//  Element highlighted function

let highlightSelection = () => {
  const filterEl = document.querySelectorAll(".filter__element");
  filterEl.forEach((filter__element) => {
    filter__element.classList.remove("highlight");
  });
  clearBtn();
  if (selectedGenre != 0) {
    selectedGenre.forEach((id) => {
      const highlightDiv = document.getElementById(id);
      highlightDiv.classList.add("highlight");
    });
  }
};

// Clear Function

let clearBtn = () => {
  const clearBtn = document.getElementById("clear");
  if (clearBtn) {
    clearBtn.classList.add("highlight");
  } else {
    const clear = document.createElement("div");
    clear.classList.add("filter__element", "highlight");
    clear.id = "clear";
    clear.innerText = "Clear X";
    clear.addEventListener("click", () => {
      selectedGenre = [];
      setGenre();
      getMovies(API_URL);
    });
    filter.appendChild(clear);
  }
};
