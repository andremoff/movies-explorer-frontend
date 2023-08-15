import './SearchForm.css';
import { useEffect, useState } from 'react';

const SearchForm = ({ handleFilterMovies, moviesTumbler, moviesInputSearch }) => {
  const [inputSearch, setInputSearch] = useState('');
  const [tumbler, setTumbler] = useState(false);

  const handleInputChange = (evt) => {
    const value = evt.target.value;
    setInputSearch(value);
    localStorage.setItem('inputSearch', value);
    handleFilterMovies(value, moviesTumbler);
  };

  const handleTumblerChange = () => {
    const newTumbler = !tumbler;
    setTumbler(newTumbler);
    localStorage.setItem('tumbler', newTumbler); 
    handleFilterMovies(inputSearch, newTumbler);
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();
    handleFilterMovies(inputSearch, moviesTumbler);
  };

  useEffect(() => {
    setTumbler(moviesTumbler || false);
    setInputSearch(moviesInputSearch || '');
  }, [moviesTumbler, moviesInputSearch]);

  return (
    <form className="search" onSubmit={handleSubmit}>
      <div className="search__wrapper">
        <div className="search__field">
          <input
            className="search__input"
            type="text"
            placeholder="Фильм"
            value={inputSearch}
            onChange={handleInputChange}
            required
          />
          <button className="search__btn" type="submit"></button>
        </div>
        <div className="search__handle">
          <label className="search__checkbox">
            <input
              className="search__tumbler"
              type="checkbox"
              checked={tumbler}
              onChange={handleTumblerChange}
            />
            <span className="search__indicator"></span>
          </label>
          <p className="search__handle-text">Короткометражки</p>
        </div>
      </div>
    </form>
  );
};

export default SearchForm;