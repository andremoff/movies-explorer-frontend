import './MoviesCardList.css';
import React, { useState } from 'react';
import MoviesCard from '../MoviesCard/MoviesCard';

// Временные данные для проверки
const movies = [
  { id: 1, title: "33 слова о дизайне", duration: "1ч42м" },
  { id: 2, title: "33 слова о дизайне", duration: "1ч42м" },
  { id: 3, title: "33 слова о дизайне", duration: "1ч42м" },
  // для теста кнопки "Ещё"
  { id: 4, title: "33 слова о дизайне", duration: "1ч42м" },
  { id: 5, title: "33 слова о дизайне", duration: "1ч42м" },
  { id: 6, title: "33 слова о дизайне", duration: "1ч42м" },
  { id: 7, title: "33 слова о дизайне", duration: "1ч42м" },
  { id: 8, title: "33 слова о дизайне", duration: "1ч42м" },
  { id: 9, title: "33 слова о дизайне", duration: "1ч42м" },
  { id: 10, title: "33 слова о дизайне", duration: "1ч42м" },
  { id: 11, title: "33 слова о дизайне", duration: "1ч42м" },
  { id: 12, title: "33 слова о дизайне", duration: "1ч42м" },
];

const MoviesCardList = () => {
  const [visibleMovies, setVisibleMovies] = useState(5);

  const loadMoreMovies = () => {
    setVisibleMovies(prevState => prevState + 5);
  };

  return (
    <section className="moviescard-list">
      <ul className="moviescard-list__items">
        {movies.slice(0, visibleMovies).map((movie) => (
          <MoviesCard key={movie.id} movie={movie} />
        ))}
      </ul>
      {visibleMovies < movies.length && (
        <div className="moviescard-list__btn-container">
          <button className="moviescard-list__btn-more" onClick={loadMoreMovies}>Ещё</button>
        </div>
      )}
    </section>
  );
};

export default MoviesCardList;
