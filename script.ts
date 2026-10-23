const API_KEY = '5434f9f5';

const searchInput = document.getElementById('search-input') as HTMLInputElement;
const searchBtn = document.getElementById('search-btn') as HTMLButtonElement;
const movieGrid = document.getElementById('movie-grid') as HTMLElement;
const movieModal = document.getElementById('movie-modal') as HTMLElement;
const modalDetails = document.getElementById('modal-details') as HTMLElement;
const closeModal = document.getElementById('close-modal') as HTMLElement;
const NO_POSTER = `data:image/svg+xml,${encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="300" height="450" viewBox="0 0 300 450"><rect width="300" height="450" fill="#2b2b2b"/><text x="150" y="220" fill="#aaa" font-family="sans-serif" font-size="18" text-anchor="middle">No poster available</text></svg>'
)}`;

interface Movie {
    imdbID: string;
    Title: string;
    Year: string;
    Poster: string;
    Type?: string;
}

interface MovieDetail extends Movie {
    Genre: string;
    Rated: string;
    Plot: string;
    Actors: string;
    imdbRating: string;
    Response: string;
}

interface SearchResponse {
    Search?: Movie[];
    Response: string;
}

searchBtn.addEventListener('click', () => {
    const query = searchInput.value.trim();
    if (query) searchMovies(query);
});

searchInput.addEventListener('keypress', (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
        const query = searchInput.value.trim();
        if (query) searchMovies(query);
    }
});

async function searchMovies(query: string): Promise<void> {
    try {
        movieGrid.innerHTML = `<p class="col-span-full text-center text-gray-400 text-lg mt-12">Loading movies...</p>`;
        const params = new URLSearchParams({ apikey: API_KEY, s: query });
        const response = await fetch(`https://www.omdbapi.com/?${params}`);
        const data: SearchResponse = await response.json();

        if (data.Response === "True" && data.Search) {
            const normalizedQuery = query.toLocaleLowerCase();
            const results = [...data.Search].sort((a, b) => {
                const aExact = a.Title.toLocaleLowerCase() === normalizedQuery;
                const bExact = b.Title.toLocaleLowerCase() === normalizedQuery;
                return Number(bExact) - Number(aExact);
            });
            displayMovies(results);
        } else {
            movieGrid.innerHTML = `<p class="col-span-full text-center text-gray-500 text-lg mt-12">No movies found matching "${query}".</p>`;
        }
    } catch (error) {
        console.error("Error fetching data:", error);
        movieGrid.innerHTML = `<p class="col-span-full text-center text-red-500 text-lg mt-12">Something went wrong. Check your connection.</p>`;
    }
}

function displayMovies(movies: Movie[]): void {
    movieGrid.innerHTML = '';
    movies.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.className = 'bg-[#1e1e1e] rounded-lg overflow-hidden shadow-lg cursor-pointer transform transition duration-200 hover:-translate-y-2 hover:shadow-red-900/20';
        movieCard.innerHTML = `
            <img src="${movie.Poster !== "N/A" ? movie.Poster : NO_POSTER}" alt="Poster for ${movie.Title}" class="w-full h-[300px] object-cover">
            <div class="p-4">
                <h3 class="font-bold text-base mb-1 truncate">${movie.Title}</h3>
                <p class="text-gray-400 text-sm">${movie.Type ? `${movie.Type} · ` : ''}${movie.Year}</p>
            </div>
        `;
        const posterImage = movieCard.querySelector('img');
        posterImage?.addEventListener('error', () => {
            posterImage.src = NO_POSTER;
        }, { once: true });

        movieCard.addEventListener('click', () => fetchMovieDetails(movie.imdbID));
        movieGrid.appendChild(movieCard);
    });
}

async function fetchMovieDetails(id: string): Promise<void> {
    try {
        const response = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&i=${id}`);
        const movie: MovieDetail = await response.json();
        if (movie.Response === "True") showModal(movie);
    } catch (error) {
        console.error("Error fetching movie details:", error);
    }
}

function showModal(movie: MovieDetail): void {
    modalDetails.innerHTML = `
        <div class="flex flex-col md:flex-row gap-6 items-start">
            <img src="${movie.Poster !== "N/A" ? movie.Poster : NO_POSTER}" alt="Poster for ${movie.Title}" class="w-full md:w-[180px] rounded object-cover">
            <div class="flex-1">
                <h2 class="text-2xl font-bold mb-2 text-white">${movie.Title} (${movie.Year})</h2>
                <p class="text-gray-400 text-sm mb-4"><strong class="text-gray-200">Genre:</strong> ${movie.Genre} | <strong class="text-gray-200">Rated:</strong> ${movie.Rated}</p>
                <p class="text-gray-300 mb-4 leading-relaxed">${movie.Plot}</p>
                <p class="text-gray-400 text-sm mb-2"><strong class="text-gray-200">Starring:</strong> ${movie.Actors}</p>
                <p class="text-[#e50914] font-bold">⭐ IMDb Rating: ${movie.imdbRating} / 10</p>
            </div>
        </div>
    `;
    const posterImage = modalDetails.querySelector('img');
    posterImage?.addEventListener('error', () => {
        posterImage.src = NO_POSTER;
    }, { once: true });
    movieModal.classList.remove('hidden');
}

closeModal.addEventListener('click', () => movieModal.classList.add('hidden'));
window.addEventListener('click', (e: MouseEvent) => {
    if (e.target === movieModal) movieModal.classList.add('hidden');
});
