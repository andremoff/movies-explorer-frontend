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
  const navigate = useNavigate();
  // Используем хук для отслеживания изменения размера экрана
  useScreenResize(setAdditionalMoviesCount);

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

  useEffect(() => {
    localStorage.setItem('moviesInputSearch', moviesInputSearch);
    localStorage.setItem('moviesTumbler', JSON.stringify(moviesTumbler));
  }, [moviesInputSearch, moviesTumbler]);

  useEffect(() => {
    // Получаем данные из localStorage при монтировании компонента
    const localMoviesInputSearch = localStorage.getItem('moviesInputSearch');
    const localMoviesTumbler = JSON.parse(localStorage.getItem('moviesTumbler'));
    const localDisplayedMovies = JSON.parse(localStorage.getItem('displayedMovies'));
    console.log("displayedMovies loaded:", localDisplayedMovies);

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

  useEffect(() => {
    // Сохраняем найденные фильмы в localStorage
    localStorage.setItem('displayedMovies', JSON.stringify(displayedMovies));
    console.log("displayedMovies saved:", displayedMovies);
  }, [displayedMovies]);

  const handleFilterMovies = useCallback((inputSearch, tumbler) => {
    setMoviesInputSearch(inputSearch);

    if (tumbler) {
      const shortMovies = allMovies.filter(movie => movie.duration <= 40);
      setDisplayedMovies(shortMovies.slice(0, additionalMoviesCount * 4));
      return;
    }

    if (!inputSearch) {
      setDisplayedMovies([]);
      return;
    }
    const filtered = filterMovies(allMovies, inputSearch, tumbler);
    setDisplayedMovies(filtered.slice(0, additionalMoviesCount * 4));
  }, [allMovies, additionalMoviesCount]);

  useEffect(() => {
    handleFilterMovies(moviesInputSearch, moviesTumbler);
  }, [additionalMoviesCount, moviesInputSearch, moviesTumbler, handleFilterMovies]);

  const handleGetMoviesTumbler = (newTumblerValue) => {
    setMoviesTumbler(newTumblerValue);
  };

  const savedMoviesToggle = async (movie, favorite) => {
    if (!Array.isArray(moviesSaved)) {
      console.error('Список сохраненных фильмов не определен');
      return;
    }

    try {
      if (favorite) {
        const existingMovie = moviesSaved.find(m => m.movieId === movie.id);
        if (existingMovie) {
          await mainApi.deleteMovie(existingMovie._id);
          setMovieSaved(prevMovies => {
            const updatedMovies = prevMovies.filter(m => m._id !== existingMovie._id);
            localStorage.setItem('savedMovies', JSON.stringify(updatedMovies));
            return updatedMovies;
          });
        }
      } else {
        const objFilm = formatMovieData(movie);
        const newSavedMovie = await mainApi.createMovie(objFilm);
        setMovieSaved(prevMovies => {
          const updatedMovies = [...prevMovies, newSavedMovie];
          localStorage.setItem('savedMovies', JSON.stringify(updatedMovies));
          return updatedMovies;
        });
      }

      const localMovies = JSON.parse(localStorage.getItem('savedMovies') || "[]");
      const localIndex = localMovies.findIndex(m => m.id === movie.id);
      if (localIndex !== -1) {
        localMovies.splice(localIndex, 1);
        localStorage.setItem('savedMovies', JSON.stringify(localMovies));
      }
    } catch (err) {
      console.error("Ошибка при обработке фильма", err);
      navigate(`/error?message=${encodeURIComponent(err.message || "Ошибка при обработке фильма")}`);
    }
  };

  // Обновление состояния оставшихся фильмов
  useEffect(() => {
    const remains = movies.slice(displayedMovies.length);
    setMoviesRemains(remains);
  }, [movies, displayedMovies]);

  // Обновление отображаемых фильмов при изменении основного списка
  useEffect(() => {
    setDisplayedMovies(movies.slice(0, additionalMoviesCount * 4));
  }, [movies, additionalMoviesCount]);

  // Обработка нажатия "Показать еще"
  const handleMoreButtonClick = () => {
    const newCount = displayedMovies.length + additionalMoviesCount;
    setDisplayedMovies(movies.slice(0, newCount));
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
            savedMoviesToggle={savedMoviesToggle}
          />
        )
      }
    </section>
  );
};

export default Movies;
