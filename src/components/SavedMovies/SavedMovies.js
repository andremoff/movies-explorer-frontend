import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

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
  }, [navigate]);

  useEffect(() => {
    const localStorageMovies = localStorage.getItem('savedMovies');
    const localStorageMoviesTumbler = localStorage.getItem('savedMoviesTumbler');
    const localStorageMoviesInputSearch = localStorage.getItem('savedMoviesInputSearch');

    if (localStorageMovies) {
      setMovies(JSON.parse(localStorageMovies));
      setmoviesTumbler(localStorageMoviesTumbler === 'true');
      setmoviesInputSearch(localStorageMoviesInputSearch || '');
    } else {
      fetchData();
    }
  }, [fetchData]);

  useEffect(() => {
    const filtered = filterMovies(movies, moviesInputSearch, moviesTumbler);
    setFilteredMovies(filtered);
  }, [movies, moviesInputSearch, moviesTumbler]);

  const handleGetMovies = (inputSearch = '', tumbler = false) => {
    setmoviesTumbler(tumbler);
    setmoviesInputSearch(inputSearch);
    localStorage.setItem('savedMoviesTumbler', tumbler.toString());
    localStorage.setItem('savedMoviesInputSearch', inputSearch);
  };

  const handleDeleteMovie = async (movieId) => {
    try {
      await deleteSavedMovie(movieId);

      console.log("Before delete:", movies);

      setMovies(prevMovies => {
        const updated = prevMovies.filter((movie) => movie.data._id !== movieId);
        console.log("After delete:", updated);

        setFilteredMovies(filterMovies(updated, moviesInputSearch, moviesTumbler));

        // Здесь обновляем localStorage после успешного удаления фильма
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
        />
      )}
    </section>
  );
};

export default SavedMovies;