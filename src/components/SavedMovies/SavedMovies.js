import React, { useState, useEffect, useCallback } from 'react';
import './SavedMovies.css';
import SearchForm from '../SearchForm/SearchForm';
import Preloader from '../Preloader/Preloader';
import MoviesCardList from '../MoviesCardList/MoviesCardList';
import { getMovies as getSavedMovies, deleteMovie as deleteSavedMovie } from '../../utils/MainApi';
import { filterMovies } from '../../utils/filterMovies';
import useAuth from '../../hooks/useAuth';

const SavedMovies = ({ openPopup }) => {
  useAuth(true);

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
      const savedMovies = await getSavedMovies();
      setMovies(savedMovies);
      localStorage.setItem('savedMovies', JSON.stringify(savedMovies));
    } catch (err) {
      setErrorText("Ошибка при получении сохранённых фильмов");
      openPopup("Ошибка при получении сохранённых фильмов");
    } finally {
      setLoading(false);
    }
  }, [openPopup]);

  // Список фильмов из localStorage
  useEffect(() => {
    const localStorageMovies = localStorage.getItem('savedMovies');

    if (localStorageMovies) {
      const parsedMovies = JSON.parse(localStorageMovies);

      if (Array.isArray(parsedMovies)) {
        setMovies(parsedMovies);
      } else {
        fetchData();
      }
    } else {
      fetchData();
    }
  }, [fetchData]);

  // Фильтрация фильмов на основе ввода и переключателя
  useEffect(() => {
    const filtered = filterMovies(movies, moviesInputSearch, moviesTumbler);
    setFilteredMovies(filtered);
  }, [movies, moviesInputSearch, moviesTumbler]);

  // Обработчик фильтрации
  const handleGetMovies = (inputSearch = '', tumbler = false) => {
    setmoviesTumbler(tumbler);
    setmoviesInputSearch(inputSearch);
  };

  // Обработчик удаления фильма
  const handleDeleteMovie = async (movieId) => {
    try {
      await deleteSavedMovie(movieId);

      setMovies(prevMovies => {
        const updated = prevMovies.filter((movie) => movie.data._id !== movieId);

        setFilteredMovies(filterMovies(updated, moviesInputSearch, moviesTumbler));

        localStorage.setItem('savedMovies', JSON.stringify(updated));

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
        moviesTumbler={moviesTumbler}
        moviesInputSearch={moviesInputSearch}
      />
      {loading && <Preloader />}
      {errorText && <div className="savedmovies__text-error">{errorText}</div>}
      {!loading && !errorText && (
        <MoviesCardList
          movies={filteredMovies}
          isSavedMovies={true}
          savedMoviesToggle={handleDeleteMovie}
          moviesSaved={movies}
        />
      )}
    </section>
  );
};

export default SavedMovies;