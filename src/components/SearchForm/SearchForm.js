import './SearchForm.css';
import { useEffect, useState } from 'react';

const SearchForm = ({ handleFilterMovies, moviesTumbler, moviesInputSearch, handleGetMoviesTumbler, saveToLocalStorage }) => {
  // Локальное состояние для ввода и переключателя.
  const [inputSearch, setInputSearch] = useState('');
  const [tumbler, setTumbler] = useState(false);

  // Обновляет значение ввода и инициирует фильтрацию фильмов.
  const handleInputChange = (evt) => {
    if (saveToLocalStorage) {
      localStorage.setItem('moviesInputSearch', evt.target.value);
    }
    setInputSearch(evt.target.value);
  };

  // Переключает состояние переключателя и инициирует фильтрацию фильмов.
  const handleTumblerChange = () => {
    const newTumbler = !tumbler;
    setTumbler(newTumbler);
    handleFilterMovies(inputSearch, newTumbler);
    handleGetMoviesTumbler(newTumbler);
  };

  // Обрабатывает отправку формы.
  const handleSubmit = (evt) => {
    evt.preventDefault();
    handleFilterMovies(inputSearch, tumbler);
  };

  // Синхронизирует локальное состояние с пропсами.
  useEffect(() => {
    setTumbler(moviesTumbler || false);
    setInputSearch(moviesInputSearch || '');
  }, [moviesTumbler, moviesInputSearch]);

  return (
 level-3
    <form className="search" onSubmit={handleSubmit}>
      <div className="search__wrapper">
        <div className="search__field">
          <input
            className="search__input"
            type="text"
            placeholder="Фильм"
            value={inputSearch}
            onChange={handleInputChange}
          />

    <form className="search">
      <div className="search__wrapper">
        <div className="search__field">
          <input className="search__input" type="text" placeholder="Фильм" required />
 main
          <button className="search__btn" type="submit"></button>
        </div>
        <div className="search__handle">
          <label className="search__checkbox">
 level-3
            <input
              className="search__tumbler"
              type="checkbox"
              checked={tumbler}
              onChange={handleTumblerChange}
            />

            <input className="search__tumbler" type="checkbox" onChange={handleCheckboxChange} />
 main
            <span className="search__indicator"></span>
          </label>
          <p className="search__handle-text">Короткометражки</p>
        </div>
      </div>
    </form>
  );
};

export default SearchForm;