import './MoviesCard.css';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const MoviesCard = ({ movie, savedMoviesToggle, moviesSaved }) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [favorite, setFavorite] = useState(false);

  const actualMovie = movie.data || movie;

  const handleFavoriteToggle = async () => {
    try {
      if (favorite) {
        const savedFilm = moviesSaved.find((obj) => obj.movieId === actualMovie.id);
        if (savedFilm) {
          await savedMoviesToggle({ ...actualMovie, _id: savedFilm._id }, false);
          setFavorite(false);
        }
      } else {
        await savedMoviesToggle(actualMovie, true);
        setFavorite(true);
      }
    } catch (err) {
      navigate(`/error?message=${encodeURIComponent(err.message || "Ошибка при изменении избранного")}`);
    }
  };

  const handleFavoriteDelete = async () => {
    try {
      await savedMoviesToggle(actualMovie._id, false);
    } catch (err) {
      navigate(`/error?message=${encodeURIComponent(err.message || "Ошибка при удалении фильма из избранного")}`);
    }
  };

  const durationToHoursAndMinutes = (duration) => {
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    return hours ? `${hours}ч ${minutes}м` : `${minutes}м`;
  };

  useEffect(() => {
    if (moviesSaved && moviesSaved.some(obj => obj.movieId === actualMovie.id)) {
      setFavorite(true);
    } else {
      setFavorite(false);
    }
  }, [moviesSaved, actualMovie.id]);

  const isSavedMoviesPath = pathname === '/saved-movies';
  const movieImage = isSavedMoviesPath ? actualMovie.image : `https://api.nomoreparties.co${actualMovie.image.url}`;

  return (
    <li className="moviescard">
      <a
        className="moviescard__image-content"
        href={isSavedMoviesPath ? actualMovie.trailer : actualMovie.trailerLink}
        target="_blank"
        rel="noopener noreferrer"
      >
        <img className="moviescard__image" src={movieImage} alt={actualMovie.nameRU} />
      </a>
      <div className="moviescard__element">
        <p className="moviescard__title">{actualMovie.nameRU}</p>
        <div className="moviescard__buttons">
          {isSavedMoviesPath ? (
            <button type="button" className="moviescard__btn moviescard__delete-btn" onClick={handleFavoriteDelete} />
          ) : (
            <button
              type="button"
              className={`moviescard__btn moviescard__btn${favorite ? '_active' : '_inactive'}`}
              onClick={handleFavoriteToggle}
            />
          )}
        </div>
      </div>
      <p className="moviescard__duration">{durationToHoursAndMinutes(actualMovie.duration)}</p>
    </li>
  );
};

export default MoviesCard;
