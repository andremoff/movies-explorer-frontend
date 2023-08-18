import './MoviesCard.css';
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const MoviesCard = ({ movie, toggleFavoriteStatus, moviesSaved }) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [favorite, setFavorite] = useState(false);
  const actualMovie = movie.data || movie;
  const isSavedMoviesPath = pathname === '/saved-movies';
  const movieImage = isSavedMoviesPath ? actualMovie.image : `https://api.nomoreparties.co${actualMovie.image.url}`;

  // Обработчик для добавления/удаления из избранного
  const handleFavoriteToggle = async () => {
    try {
      console.log("Удаляем фильм с ID:", actualMovie._id);
      if (isSavedMoviesPath) {
        await toggleFavoriteStatus(actualMovie._id);  // передаем _id фильма
      } else {
        await toggleFavoriteStatus(actualMovie);
      }
    } catch (err) {
      navigate(`/error?message=${encodeURIComponent(err.message || "Ошибка при изменении избранного")}`);
    }
  };

  useEffect(() => {
    const isFavorite = movie.isFavorited || moviesSaved.some(savedMovie => savedMovie.movieId === actualMovie.id);
    setFavorite(isFavorite);
  }, [actualMovie, moviesSaved, movie.isFavorited]);

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
            <button type="button" className="moviescard__btn moviescard__delete-btn" onClick={handleFavoriteToggle} />
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