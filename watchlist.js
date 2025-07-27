const watchlistEl = document.getElementById('watchlist');
const emptyEl     = document.getElementById('emptyWatchlist');

function getWatchlist() {
  return JSON.parse(localStorage.getItem('watchlist') || '[]');
}
function saveWatchlist(arr) {
  localStorage.setItem('watchlist', JSON.stringify(arr));
}

function renderWatchlist() {
  const list = getWatchlist();
  watchlistEl.innerHTML = '';
  if (!list.length) {
    emptyEl.style.display = 'block';
    return;
  }
  emptyEl.style.display = 'none';

  list.forEach(movie => {
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
          <button class="btn-watchlist remove" title="Remove"></button>
        </div>
        <p class="plot">
          ${movie.Plot.length > 150 ? movie.Plot.slice(0,150) + '…' : movie.Plot}
        </p>
      </div>
    `;
    card.querySelector('button').addEventListener('click', () => {
      const updated = getWatchlist().filter(m => m.imdbID !== movie.imdbID);
      saveWatchlist(updated);
      renderWatchlist();
    });
    watchlistEl.appendChild(card);
  });
}

document.addEventListener('DOMContentLoaded', renderWatchlist);
