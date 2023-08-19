import React, { useState, useEffect, useCallback } from 'react';
import './SavedMovies.css';
import SearchForm from '../SearchForm/SearchForm';
import Preloader from '../Preloader/Preloader';
import MoviesCardList from '../MoviesCardList/MoviesCardList';
import { getMovies as getSavedMovies, deleteMovie as deleteSavedMovie } from '../../utils/MainApi';
import { filterMovies } from '../../utils/filterMovies';

const SavedMovies = ({ openPopup }) => {
  const [loading, setLoading] = useState(false);
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [errorText, setErrorText] = useState('');
  const [moviesTumbler, setmoviesTumbler] = useState(false);
  const [moviesInputSearch, setmoviesInputSearch] = useState('');

  // Запрос сохранённых фильмов с сервера
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const allMovies = await getSavedMovies();
      //console.log("All movies:", allMovies.data); <---- ЛОГИ
      setMovies(allMovies.data);
    } catch (err) {
      setErrorText("Ошибка при получении сохранённых фильмов");
      openPopup("Ошибка при получении сохранённых фильмов");
    } finally {
      setLoading(false);
    }
  }, [openPopup]);


  // Загрузка сохраненных фильмов при инициализации компонента
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Фильтрация фильмов на основе ввода и переключателя
  useEffect(() => {
    /*console.log("Filtering movies with:", { <---- ЛОГИ
      moviesList: movies,
      searchTerm: moviesInputSearch,
      tumblerStatus: moviesTumbler
    });*/
    const filtered = filterMovies(movies, moviesInputSearch, moviesTumbler);
    //console.log("Filtered movies:", filtered);
    setFilteredMovies(filtered);
  }, [movies, moviesInputSearch, moviesTumbler]);

  // Обработчик фильтрации
  const handleGetMovies = (inputSearch = '', tumbler = false) => {
    //console.log("Filter parameters:", inputSearch, tumbler); <---- ЛОГИ
    setmoviesTumbler(tumbler);
    setmoviesInputSearch(inputSearch);
  };
  // Обработчик переключателя "короткометражек"
  const handleGetMoviesTumbler = (tumbler) => {
    //console.log("Tumbler changed:", tumbler); <---- ЛОГИ
    setmoviesTumbler(tumbler);
  };

  // Обработчик удаления фильма
  const handleDeleteMovie = async (movieId) => {
    try {
      await deleteSavedMovie(movieId);

      setMovies(prevMovies => {
        const updated = prevMovies.filter((movie) => movie._id !== movieId);
        setFilteredMovies(filterMovies(updated, moviesInputSearch, moviesTumbler));
        return updated;
      });

    } catch (err) {
      setErrorText("Ошибка при удалении фильма");
      openPopup("Ошибка при удалении фильма");
    }
  };

  return (
    <section className="savedmovies">
      <SearchForm
        handleFilterMovies={handleGetMovies}
        handleGetMoviesTumbler={handleGetMoviesTumbler}
        moviesTumbler={moviesTumbler}
        moviesInputSearch={moviesInputSearch}
      />
      {loading && <Preloader />}
      {errorText && <div className="savedmovies__text-error">{errorText}</div>}
      {!loading && !errorText && (
        <MoviesCardList
          movies={movies}
          isSavedMovies={true}
          toggleFavoriteStatus={handleDeleteMovie}
          moviesSaved={filteredMovies}
        />
      )}
    </section>
  );
};

export default SavedMovies;
