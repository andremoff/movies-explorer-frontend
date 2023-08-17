export const formatMovieData = (movie) => {
  return {
    movieId: movie.id,
    nameRU: movie.nameRU,
    nameEN: movie.nameEN,
    director: movie.director || 'Нет данных',
    country: movie.country || 'Нет данных',
    year: movie.year || 'Нет данных',
    duration: movie.duration,
    description: movie.description || 'Нет данных',
    trailerLink: movie.trailerLink,
    image: 'https://api.nomoreparties.co' + movie.image.url,
    thumbnail: 'https://api.nomoreparties.co' + movie.image.url,
  };
};