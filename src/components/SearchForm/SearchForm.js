import React, { useState } from 'react';
import './SearchForm.css';

const SearchForm = () => {
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  return (
    <form className="search">
      <div className="search__wrapper">
        <div className="search__field">
          <input className="search__input" type="text" placeholder="Фильм" required />
          <button className="search__btn" type="submit"></button>
        </div>
        <div className="search__handle">
          <label className="search__checkbox">
            <input className="search__tumbler" type="checkbox" onChange={handleCheckboxChange} />
            <span className="search__indicator"></span>
          </label>
          <p className="search__handle-text">Короткометражки</p>
        </div>
      </div>
    </form>
  );
};

export default SearchForm;