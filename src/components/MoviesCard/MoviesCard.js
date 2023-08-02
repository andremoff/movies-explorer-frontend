import './MoviesCard.css';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import MoviePictures from '../../images/movie-pic-test.png';

const MoviesCard = ({ movie }) => {
  const { pathname } = useLocation();
  const [favorite, setFavorite] = useState(false);

  const handleClick = () => {
    setFavorite(!favorite);
  };

  return (
    <li className="moviescard">
      <a className="moviescard__image-content" href="/saved-movies" target="_blank" rel="noopener noreferrer">
        <img className="moviescard__image" src={MoviePictures} alt="Постер фильма"></img>
      </a>
      <div className="moviescard__element">
        <p className="moviescard__title">{movie.title}</p>
        <div className="moviescard__buttons">
          {pathname === '/saved-movies' ? (
            <button type="button" className="moviescard__btn moviescard__delete-btn" />
          ) : (
            <button type="button" className={`moviescard__btn moviescard__btn${favorite ? '_active' : '_inactive'}`} onClick={handleClick} />
          )}
        </div>
      </div>
      <p className="moviescard__duration">{movie.duration}</p>
    </li>
  );
};

export default MoviesCard;