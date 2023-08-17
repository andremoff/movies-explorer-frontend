import './MoviesCard.css';
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const MoviesCard = ({ movie, savedMoviesToggle, moviesSaved, isSaved }) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [favorite, setFavorite] = useState(isSaved);
  const [isMovieSaved, setIsMovieSaved] = useState(false);
  const actualMovie = movie.data || movie;
  const isSavedMoviesPath = pathname === '/saved-movies';
  const movieImage = isSavedMoviesPath ? actualMovie.image : `https://api.nomoreparties.co${actualMovie.image.url}`;

  // Обработчик для добавления/удаления из избранного
  const handleFavoriteToggle = async () => {
    try {
      if (favorite) {
        const savedMovie = moviesSaved.find((obj) => obj.movieId === actualMovie.id);
        if (savedMovie) {
          await savedMoviesToggle({ ...actualMovie, _id: savedMovie._id }, favorite);
        }
      } else {
        await savedMoviesToggle(actualMovie, favorite);
      }
      setFavorite(!favorite);
    } catch (err) {
      navigate(`/error?message=${encodeURIComponent(err.message || "Ошибка при изменении избранного")}`);
    }
  };

  useEffect(() => {
    setIsMovieSaved(moviesSaved.some(m => m.movieId === actualMovie.id));
  }, [moviesSaved, actualMovie.id]);

  // Обработчик для удаления фильма из избранного
  const handleFavoriteDelete = async () => {
    try {
      if (isSavedMoviesPath) {
        await savedMoviesToggle(actualMovie._id, false);
      }
    } catch (err) {
      navigate(`/error?message=${encodeURIComponent(err.message || "Ошибка при удалении фильма из избранного")}`);
    }
  };

  // Конвертация продолжительности фильма в формат "чч мм"
  const durationToHoursAndMinutes = (duration) => {
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    return hours ? `${hours}ч ${minutes}м` : `${minutes}м`;
  };

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
              className={`moviescard__btn moviescard__btn${favorite || isMovieSaved ? '_active' : '_inactive'}`}
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
