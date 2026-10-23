declare const API_KEY = "5434f9f5";
declare const searchInput: HTMLInputElement;
declare const searchBtn: HTMLButtonElement;
declare const movieGrid: HTMLElement;
declare const movieModal: HTMLElement;
declare const modalDetails: HTMLElement;
declare const closeModal: HTMLElement;
declare const NO_POSTER: string;
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
declare function searchMovies(query: string): Promise<void>;
declare function displayMovies(movies: Movie[]): void;
declare function fetchMovieDetails(id: string): Promise<void>;
declare function showModal(movie: MovieDetail): void;
//# sourceMappingURL=script.d.ts.map