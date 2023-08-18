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
import useAuth from '../../hooks/useAuth';

const Movies = ({ openPopup }) => {
  useAuth(true);

  const [loading, setLoading] = useState(false);
  const [movies, setMovies] = useState([]);
  const [allMovies, setAllMovies] = useState([]);
  const [moviesRemains, setMoviesRemains] = useState([]);
  const [moviesInputSearch, setMoviesInputSearch] = useState('');
  const [moviesTumbler, setMoviesTumbler] = useState(false);
  const [displayedMovies, setDisplayedMovies] = useState([]);
  const [additionalMoviesCount, setAdditionalMoviesCount] = useState(0);
  const [moviesSaved, setMovieSaved] = useState([]);
  const [userInteracted, setUserInteracted] = useState(false);
  const navigate = useNavigate();
  // Используем хук для отслеживания изменения размера экрана
  useScreenResize(setAdditionalMoviesCount);

  // Загрузка фильмов или получение их из localStorage
  useEffect(() => {
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

  // Сохранение состояния строки поиска и тумблера в localStorage
  useEffect(() => {
    localStorage.setItem('moviesInputSearch', moviesInputSearch);
    localStorage.setItem('moviesTumbler', JSON.stringify(moviesTumbler));
  }, [moviesInputSearch, moviesTumbler]);

  // Получение данных из localStorage при монтировании компонента
  useEffect(() => {
    const localMoviesInputSearch = localStorage.getItem('moviesInputSearch');
    const localMoviesTumbler = JSON.parse(localStorage.getItem('moviesTumbler'));
    const localDisplayedMovies = JSON.parse(localStorage.getItem('displayedMovies'));

    if (localMoviesInputSearch) {
      setMoviesInputSearch(localMoviesInputSearch);
    }

    if (localMoviesTumbler !== null) {
      setMoviesTumbler(localMoviesTumbler);
    }

    if (localDisplayedMovies && localDisplayedMovies.length > 0) {
      setDisplayedMovies(localDisplayedMovies);
    }

  }, []);

  // Сохранение отображаемых фильмов в localStorage
  useEffect(() => {
    localStorage.setItem('displayedMovies', JSON.stringify(displayedMovies));
  }, [displayedMovies]);

  // Фильтрация фильмов на основе ввода пользователя
  const handleFilterMovies = useCallback((inputSearch, tumbler) => {
    setMoviesInputSearch(inputSearch);
    setUserInteracted(true);
    const filteredMovies = filterMovies(allMovies, inputSearch, tumbler);
    setDisplayedMovies(filteredMovies.slice(0, additionalMoviesCount * 4));

    // Обновляем состояние moviesRemains после displayedMovies
    const remains = filteredMovies.slice(additionalMoviesCount * 4);
    setMoviesRemains(remains);
  }, [allMovies, additionalMoviesCount]);

  // Фильтрация фильмов при изменении размера экрана, строки поиска или тумблера
  useEffect(() => {
    handleFilterMovies(moviesInputSearch, moviesTumbler);
  }, [additionalMoviesCount, moviesInputSearch, moviesTumbler, handleFilterMovies]);

  const handleGetMoviesTumbler = (newTumblerValue) => {
    setMoviesTumbler(newTumblerValue);
  };

  // Обработка добавления или удаления фильма из избранного
  const toggleFavoriteStatus = async (movie) => {
    try {
      console.log("Movie object for toggleFavoriteStatus:", movie);
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
  const deleteMovieFromFavorites = async (movie) => {
    console.log("Movie object for deletion:", movie);
    await mainApi.deleteMovie(movie._id);
    movie.isFavorited = false;
  };
  //Добавляет фильм в избранное на сервере
  const addMovieToFavorites = async (movie) => {
    const formattedMovie = formatMovieData(movie);
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

  // Обновление отображаемых фильмов при изменении основного списка
  useEffect(() => {
    setDisplayedMovies(movies.slice(0, additionalMoviesCount * 4));
  }, [movies, additionalMoviesCount]);

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
      />
      {
        loading ? (
          <Preloader />
        ) : (
          <MoviesCardList
            movies={displayedMovies}
            moviesRemains={moviesRemains}
            moviesSaved={moviesSaved}
            handleMore={handleMoreButtonClick}
            isButtonVisible={moviesRemains.length > 0}
            toggleFavoriteStatus={toggleFavoriteStatus}
            userInteracted={userInteracted}
          />
        )
      }
    </section>
  );
};

export default Movies;