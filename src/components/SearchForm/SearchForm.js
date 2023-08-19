import './SearchForm.css';
import { useEffect, useState } from 'react';

const SearchForm = ({ handleFilterMovies, moviesTumbler, moviesInputSearch, handleGetMoviesTumbler }) => {
  // Локальное состояние для ввода и переключателя.
  const [inputSearch, setInputSearch] = useState('');
  const [tumbler, setTumbler] = useState(false);

  // Обновляет значение ввода и инициирует фильтрацию фильмов.
  const handleInputChange = (evt) => {
    //console.log('импут');
    //console.log(evt.target.value);
    //const value = evt.target.value;
    localStorage.setItem('moviesInputSearch', evt.target.value);
    setInputSearch(evt.target.value);
  };

  // Переключает состояние переключателя и инициирует фильтрацию фильмов.
  const handleTumblerChange = () => {
    const newTumbler = !tumbler;
    setTumbler(newTumbler);
    handleFilterMovies(inputSearch, newTumbler);
    handleGetMoviesTumbler(newTumbler); // добавьте это
  };

  // Обрабатывает отправку формы.
  const handleSubmit = (evt) => {
    //console.log('сабмит');
    evt.preventDefault();
    //localStorage.setItem('moviesInputSearch', moviesInputSearch);
    //console.log(moviesInputSearch);
    handleFilterMovies(inputSearch, moviesTumbler);
  };

  // Синхронизирует локальное состояние с пропсами.
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