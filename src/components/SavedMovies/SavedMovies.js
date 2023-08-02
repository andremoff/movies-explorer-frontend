import React, { useState, useEffect } from 'react';
import './SavedMovies.css';
import SearchForm from '../SearchForm/SearchForm';
import Preloader from '../Preloader/Preloader';
import MoviesCardList from '../MoviesCardList/MoviesCardList';

const SavedMovies = () => {
  const [loading, setLoading] = useState(false);
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterShort, setFilterShort] = useState(false);

  useEffect(() => {
  }, []);
  
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const handleFilter = (e) => {
    setFilterShort(e.target.checked);
  };

  const filteredMovies = movies.filter((movie) => {
    return movie.title.includes(searchTerm) && (!filterShort || movie.isShort);
  });

  return (
    <section className="savedmovies">
      <SearchForm onSearch={handleSearch} onFilter={handleFilter} />
      {loading ? <Preloader /> : <MoviesCardList movies={filteredMovies} />}
    </section>
  );
};

export default SavedMovies;