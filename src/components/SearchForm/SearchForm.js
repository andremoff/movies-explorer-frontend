import React, { useState } from 'react';
import './SearchForm.css';

const SearchForm = () => {
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  return (
    <form className="search">
      <div className="search__field">
        <input className="search__input" type="text" placeholder="Фильм" />
        <button className="search__button" type="submit"></button>
      </div>
      <div className="search__handle">
        <label className="search__handle-checkbox">
          <input className="search__handle-checkbox-input" type="checkbox" onChange={handleCheckboxChange} />
          <span className="search__handle-checkbox-indicator"></span>
        </label>
        <p className="search__handle-text">Короткометражки</p>
      </div>
    </form>
  );
};

export default SearchForm;