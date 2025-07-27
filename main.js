const API_KEY = '34dceb6a';
const form = document.getElementById('searchForm');
const resultsEl = document.getElementById('results');
const noResultsEl = document.getElementById('noResults');
let currentMovies = [];

function getWatchlist() {
  return JSON.parse(localStorage.getItem('watchlist') || '[]');
}
function saveWatchlist(arr) {
  localStorage.setItem('watchlist', JSON.stringify(arr));
}
async function fetchJSON(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return res.json();
  } catch (error) {
    console.error('Fetch error:', error);
    return { Response: 'False', Error: 'Network error' };
  }
}

function renderMovies(movies) {
  resultsEl.innerHTML = '';
  if (!movies.length) {
    noResultsEl.style.display = 'block';
    return;
  }
  noResultsEl.style.display = 'none';

  movies.forEach(movie => {
    const inList = getWatchlist().some(m => m.imdbID === movie.imdbID);
    const btnClass = inList ? 'remove' : 'add';

    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <img
        src="${movie.Poster !== 'N/A' ? movie.Poster : 'no-poster.png'}"
        alt="${movie.Title}"
      />
      <div class="card-content">
        <h2>
          ${movie.Title} <span>★ ${movie.imdbRating}</span>
        </h2>
        <div class="meta">
          ${movie.Runtime} · ${movie.Genre}
          <button class="btn-watchlist ${btnClass}" 
                  title="${inList ? 'Remove' : 'Add'}"></button>
        </div>
        <p class="plot">
          ${movie.Plot.length > 150 ? movie.Plot.slice(0,150) + '…' : movie.Plot}
        </p>
      </div>
    `;

    card.querySelector('button').addEventListener('click', () => {
      let list = getWatchlist();
      if (inList) {
        list = list.filter(m => m.imdbID !== movie.imdbID);
      } else {
        list.push(movie);
      }
      saveWatchlist(list);
      renderMovies(currentMovies);
    });

    resultsEl.appendChild(card);
  });
}

form.addEventListener('submit', async ev => {
  ev.preventDefault();
  const q = document.getElementById('query').value.trim();
  if (!q) return;

  try {
    const search = await fetchJSON(
      `https://www.omdbapi.com/?apikey=${API_KEY}&type=movie&s=${encodeURIComponent(q)}`
    );
    if (search.Response === 'False') {
      renderMovies([]);
      return;
    }

    const details = await Promise.all(
      search.Search.map(m =>
        fetchJSON(
          `https://www.omdbapi.com/?apikey=${API_KEY}&i=${m.imdbID}&plot=short`
        )
      )
    );
    currentMovies = details.filter(m => m.Response !== 'False');
    renderMovies(currentMovies);
  } catch (error) {
    console.error('Search error:', error);
    renderMovies([]);
  }
});
