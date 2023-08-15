// Вспомогательная функция для извлечения данных фильма
const extractMovieData = (movie) => {
  return movie.data ? movie.data : movie;
};

// Функция для фильтрации фильмов по имени
const filterByName = (movies, searchTerm) => {
  if (!searchTerm.trim()) {
    return movies;
  }

  return movies.filter(movie => {
    const movieData = extractMovieData(movie);
    return (movieData.nameRU && movieData.nameRU.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (movieData.nameEN && movieData.nameEN.toLowerCase().includes(searchTerm.toLowerCase()));
  });
};

// Функция для фильтрации короткометражных фильмов
const filterByShortDuration = (movies) => {
  return movies.filter(movie => {
    const movieData = extractMovieData(movie);
    const duration = movieData.duration;
    return duration && duration <= 40;
  });
};

// Главная функция фильтрации
export const filterMovies = (movies, searchTerm = '', filterShort = false) => {
  let filteredMovies = filterByName(movies, searchTerm.toString());

  if (filterShort) {
    filteredMovies = filterByShortDuration(filteredMovies);
  }

  return filteredMovies;
};
