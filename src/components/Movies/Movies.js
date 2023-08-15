import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Movies.css';
import SearchForm from '../SearchForm/SearchForm';
import MoviesCardList from '../MoviesCardList/MoviesCardList';
import Preloader from '../Preloader/Preloader';
import moviesApi from '../../utils/MoviesApi';
import * as mainApi from '../../utils/MainApi';
import { filterMovies } from '../../utils/filterMovies';

const Movies = ({ openPopup }) => {
  const [loading, setLoading] = useState(false);
  const [movies, setMovies] = useState([]);
  const [allMovies, setAllMovies] = useState([]);
  const [moviesRemains, setMoviesRemains] = useState([]);
  const [moviesInputSearch, setMoviesInputSearch] = useState('');
  const [moviesTumbler, setMoviesTumbler] = useState(false);
  const [displayedMovies, setDisplayedMovies] = useState([]);
  const [additionalMoviesCount, setAdditionalMoviesCount] = useState(0);
  const [movieSaved, setMovieSaved] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    moviesApi.getMovies()
      .then(allMovies => {
        const movieIds = allMovies.map(movie => movie._id);
        localStorage.setItem('movieIds', JSON.stringify(movieIds));
        setAllMovies(allMovies);
        setMovies(allMovies);
      })
      .catch(() => {
        openPopup("Во время запроса произошла ошибка. Возможно, проблема с соединением или сервер недоступен. Подождите немного и попробуйте ещё раз");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const savedSearch = localStorage.getItem('savedSearch');
    if (savedSearch) {
      const parsedSearch = JSON.parse(savedSearch);
      setMoviesInputSearch(parsedSearch.moviesInputSearch || '');
      setMoviesTumbler(parsedSearch.moviesTumbler === "true" || false);
      setMovies(parsedSearch.movies || []);
    }

    const savedMovies = localStorage.getItem('savedMovies');
    if (savedMovies) {
      try {
        setMovieSaved(JSON.parse(savedMovies));
      } catch (e) {
        openPopup("Ошибка при чтении сохраненных фильмов");
      }
    }
  }, []);

  const checkScreenWidth = () => {
    const width = window.innerWidth;
    if (width >= 1280) {
      setAdditionalMoviesCount(4);
    } else if (width >= 768) {
      setAdditionalMoviesCount(4);
    } else {
      setAdditionalMoviesCount(2);
    }
  };

  const resizeTimer = useRef(null);

  useEffect(() => {
    checkScreenWidth();
    const handleResize = () => {
      if (resizeTimer.current) {
        clearTimeout(resizeTimer.current);
      }

      resizeTimer.current = setTimeout(() => {
        checkScreenWidth();
      }, 300);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      if (resizeTimer.current) {
        clearTimeout(resizeTimer.current);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const remains = movies.slice(displayedMovies.length);
    setMoviesRemains(remains);
  }, [movies, displayedMovies]);

  useEffect(() => {
    setDisplayedMovies(movies.slice(0, additionalMoviesCount * 4));
  }, [movies, additionalMoviesCount]);

  const handleMoreButtonClick = () => {
    const newCount = displayedMovies.length + additionalMoviesCount;
    setDisplayedMovies(movies.slice(0, newCount));
  };

  const saveToLocalStorage = (inputSearch, tumbler) => {
    localStorage.setItem('savedSearch', JSON.stringify({
      moviesInputSearch: inputSearch,
      moviesTumbler: tumbler,
      foundMovies: movies
    }));
  };

  const handleFilterMovies = (inputSearch, tumbler) => {
    setMoviesInputSearch(inputSearch);
    const filtered = filterMovies(allMovies, inputSearch, tumbler);
    setMovies(filtered);
    setDisplayedMovies(filtered.slice(0, additionalMoviesCount * 4));
    saveToLocalStorage(inputSearch, tumbler);
  };

  const savedMoviesToggle = async (movie, favorite) => {
    const existingMovie = movieSaved.find(m => m.movieId === movie.id);

    try {
      if (favorite) {
        if (existingMovie) {
          console.log('Фильм уже в избранном');
          return;
        }

        const objFilm = {
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
        console.log('Creating movie with data:', objFilm);
        const newSavedMovie = await mainApi.createMovie(objFilm);
        console.log("New Saved Movie ID:", newSavedMovie._id);
        setMovieSaved(prevMovies => {
          const updatedMovies = [...prevMovies, newSavedMovie];
          localStorage.setItem('savedMovies', JSON.stringify(updatedMovies));
          return updatedMovies;
        });

        // Сохраняем movie._id в localStorage
        const savedMovieIds = JSON.parse(localStorage.getItem('movieIds')) || [];
        savedMovieIds.push(newSavedMovie._id);
        localStorage.setItem('movieIds', JSON.stringify(savedMovieIds));

      } else {
        if (!existingMovie) {
          console.log('Фильм не найден в избранном');
          return;
        }

        await mainApi.deleteMovie(existingMovie._id);
        setMovieSaved(prevMovies => {
          const updatedMovies = prevMovies.filter(m => m._id !== existingMovie._id);
          localStorage.setItem('savedMovies', JSON.stringify(updatedMovies));
          return updatedMovies;
        });

        // Удаляем movie._id из localStorage
        const savedMovieIds = JSON.parse(localStorage.getItem('movieIds')) || [];
        const index = savedMovieIds.indexOf(movie._id);
        if (index !== -1) savedMovieIds.splice(index, 1);
        localStorage.setItem('movieIds', JSON.stringify(savedMovieIds));
      }

    } catch (err) {
      console.error("Ошибка при обработке фильма", err);
      navigate(`/error?message=${encodeURIComponent(err.message || "Ошибка при обработке фильма")}`);
    }
  };

  const handleGetMoviesTumbler = (newTumblerValue) => {
    setMoviesTumbler(newTumblerValue);
    saveToLocalStorage(moviesInputSearch, newTumblerValue);
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
            movieSaved={movieSaved}
            handleMore={handleMoreButtonClick}
            isButtonVisible={moviesRemains.length > 0}
            savedMoviesToggle={savedMoviesToggle}
            handleFavoriteToggle={savedMoviesToggle}
          />
        )
      }
    </section>
  );
};

export default Movies;
