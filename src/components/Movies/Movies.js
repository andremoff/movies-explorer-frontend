import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './Movies.css';
import SearchForm from '../SearchForm/SearchForm';
import MoviesCardList from '../MoviesCardList/MoviesCardList';
import Preloader from '../Preloader/Preloader';
import moviesApi from '../../utils/MoviesApi';
import * as mainApi from '../../utils/MainApi';
import { filterMovies } from '../../utils/filterMovies';
import { useScreenResize } from '../../hooks/screenHooks';
import { formatMovieData } from '../../utils/movieDataUtils';

const Movies = ({ openPopup }) => {

  const [loading, setLoading] = useState(false);
  const [movies, setMovies] = useState([]);
  const [allMovies, setAllMovies] = useState([]);
  const [moviesRemains, setMoviesRemains] = useState([]);
  const [moviesInputSearch, setMoviesInputSearch] = useState('');
  const [moviesTumbler, setMoviesTumbler] = useState(false);
  const [displayedMovies, setDisplayedMovies] = useState([]);
  const [additionalMoviesCount, setAdditionalMoviesCount] = useState(0);
  const [moviesSaved, setMovieSaved] = useState([]);
  const navigate = useNavigate();
  // Используем хук для отслеживания изменения размера экрана
  useScreenResize(setAdditionalMoviesCount);

  // Загрузка фильмов или получение их из localStorage
  useEffect(() => {
    console.log('загрузка фильмов'); //<---- убрать логи

    // Загрузка фильмов или получение их из localStorage
    if (localStorage.getItem('movies')) {
      const cachedMovies = JSON.parse(localStorage.getItem('movies'));
      setAllMovies(cachedMovies);
    } else {
      setLoading(true);
      moviesApi.getMovies()
        .then(allMovies => {
          setAllMovies(allMovies);
          localStorage.setItem('movies', JSON.stringify(allMovies));
        })
        .catch(() => {
          openPopup("Во время запроса произошла ошибка. Возможно, проблема с соединением или сервер недоступен. Подождите немного и попробуйте ещё раз");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [openPopup]);

  const getLocalMovieId = (movie) => movie.movieId || movie.id;
  console.log('получение идентификатора фильма'); //<---- убрать логи
  // Фильтрация фильмов на основе ввода пользователя
  const handleFilterMovies = useCallback((inputSearch, tumbler) => {
    setMoviesInputSearch(inputSearch);
    const filteredMovies = filterMovies(allMovies, inputSearch, tumbler);
    setDisplayedMovies(filteredMovies.slice(0, additionalMoviesCount * 4));

    // Обновляем состояние moviesRemains после displayedMovies
    const remains = filteredMovies.slice(additionalMoviesCount * 4);
    setMoviesRemains(remains);
  }, [allMovies, additionalMoviesCount]);

  const handleGetMoviesTumbler = (newTumblerValue) => {
    console.log('Tumbler changed:', newTumblerValue); //<---- убрать логи
    setMoviesTumbler(newTumblerValue);
    localStorage.setItem('moviesTumbler', JSON.stringify(newTumblerValue));
  };

  useEffect(() => {
    console.log('фильтрация фильмов'); //<---- убрать логи

    if (allMovies && allMovies.length > 0) {
      // Получаем значение moviesInputSearch из localStorage
      const localMoviesInputSearch = localStorage.getItem('moviesInputSearch');

      if (localMoviesInputSearch) {
        setMoviesInputSearch(localMoviesInputSearch);
        const filteredMovies = filterMovies(allMovies, localMoviesInputSearch, moviesTumbler);
        setDisplayedMovies(filteredMovies.slice(0, additionalMoviesCount * 4));

        const remains = filteredMovies.slice(additionalMoviesCount * 4);
        setMoviesRemains(remains);
      }

      // Получаем значение moviesTumbler из localStorage
      const localMoviesTumbler = JSON.parse(localStorage.getItem('moviesTumbler'));

      if (localMoviesTumbler !== null) {
        setMoviesTumbler(localMoviesTumbler);
      }
    }
  }, [allMovies, moviesTumbler, additionalMoviesCount]);

  // Обработка добавления или удаления фильма из избранного
  const toggleFavoriteStatus = async (movie) => {
    try {
      console.log("Movie object for toggleFavoriteStatus:", movie); //<---- убрать логи
      if (movie.isFavorited) {
        await deleteMovieFromFavorites(movie);
      } else {
        await addMovieToFavorites(movie);
      }
      updateLocalMovies(movie);
    } catch (err) {
      handleToggleError(err);
    }
  };
  //Удаляем фильм из избранного на сервере
  const deleteMovieFromFavorites = async (movieId) => {
    console.log("Movie object for deletion:", movieId); //<---- убрать логи
    await mainApi.deleteMovie(movieId  || movieId._id);
    movieId.isFavorited = false;
  };

  //Добавляет фильм в избранное на сервере
  const addMovieToFavorites = async (movie) => {
    console.log("Initial movie data:", movie);
    const formattedMovie = formatMovieData(movie);
    console.log("Formatted movie data:", formattedMovie);
    const savedMovie = await mainApi.createMovie(formattedMovie);
    
    movie.isFavorited = true;
    movie._id = savedMovie._id;
  };

  //Обновляем список фильмов в локальном состоянии и локальном хранилище.
  const updateLocalMovies = (updatedMovie) => {
    const localMovieId = getLocalMovieId(updatedMovie);
    const updatedMovies = allMovies.map(m =>
      getLocalMovieId(m) === localMovieId ? updatedMovie : m
    );
    setAllMovies(updatedMovies);
    localStorage.setItem('movies', JSON.stringify(updatedMovies));
  };

  const handleToggleError = (err) => {
    console.error("Ошибка при обработке фильма", err);
    navigate(`/error?message=${encodeURIComponent(err.message || "Ошибка при обработке фильма")}`);
  };

  // Обработка нажатия "Показать еще"
  const handleMoreButtonClick = () => {
    const newDisplayedMovies = [...displayedMovies, ...moviesRemains.slice(0, additionalMoviesCount)];
    setDisplayedMovies(newDisplayedMovies);

    const remains = moviesRemains.slice(additionalMoviesCount);
    setMoviesRemains(remains);
  };

  return (
    <section className="movies">
      <SearchForm
        handleFilterMovies={handleFilterMovies}
        moviesTumbler={moviesTumbler}
        handleGetMoviesTumbler={handleGetMoviesTumbler}
        moviesInputSearch={moviesInputSearch}
        saveToLocalStorage={true}
      />
      {
        loading ? (
          <Preloader />
        ) : (
          <>
            {displayedMovies.length === 0 && moviesInputSearch !== '' && (
              <p className="movies__empty">Ничего не найдено</p>
            )}
            <MoviesCardList
              movies={displayedMovies}
              moviesRemains={moviesRemains}
              moviesSaved={moviesSaved}
              handleMore={handleMoreButtonClick}
              isButtonVisible={moviesRemains.length > 0}
              toggleFavoriteStatus={toggleFavoriteStatus}
            />
          </>
        )
      }
    </section>
  );
};

export default Movies;