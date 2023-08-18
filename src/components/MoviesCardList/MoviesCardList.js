import './MoviesCardList.css';
import { useLocation } from 'react-router-dom';
import MoviesCard from '../MoviesCard/MoviesCard';

const MoviesCardList = ({ movies, toggleFavoriteStatus, moviesSaved, moviesRemains, handleMore, userInteracted }) => {
  const { pathname } = useLocation();

  return (
    <section className="moviescard-list">
      {movies.length > 0 ? (
        <ul className="moviescard-list__items">
          {movies.map((movie) => {
            return (
              <MoviesCard
                key={movie.id || movie.movieId || movie.data._id}
                movie={movie}
                toggleFavoriteStatus={toggleFavoriteStatus}
                moviesSaved={moviesSaved}
                isSaved={moviesSaved.some(m => m.movieId === (movie.id || movie.movieId || movie.data._id))}
              />
            );
          })}
        </ul>
      ) : userInteracted &&  (
        <p className="moviescard-list__empty">Ничего не найдено</p>
      )}

      {moviesRemains && moviesRemains.length > 0 && pathname !== '/saved-movies' && (
        <div className="moviescard-list__btn-container">
          <button className="moviescard-list__btn-more" type="button" name="more" onClick={handleMore}>Ещё</button>
        </div>
      )}
    </section>
  );
};

export default MoviesCardList;
