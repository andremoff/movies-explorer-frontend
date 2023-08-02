import './Navigation.css';
import { useState } from 'react';
import { useMatch, Link } from 'react-router-dom';
import accountIcon from '../../images/account-icon.svg';

const Navigation = () => {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const matchHome = useMatch("/");
  const matchMovies = useMatch("/movies");
  const matchSavedMovies = useMatch("/saved-movies");

  const toggleMenu = () => setMenuOpen(!isMenuOpen);

  return (
    <nav className="navigation">
      <div className={`navigation__menu ${isMenuOpen ? 'navigation__menu_visible' : ''}`}>
        <div className="navigation__menu-content">
          <div className="navigation__links-container">
            <button className="navigation__menu-close-btn" type="button" onClick={toggleMenu}></button>
            <ul className="navigation__links-list">
              <li className="navigation__link-item">
                <Link to="/" className={`navigation__link navigation__link_hidden ${matchHome ? 'navigation__link_active' : ''}`}>Главная</Link>
              </li>
              <li className="navigation__link-item">
                <Link to="/movies" className={`navigation__link ${matchMovies ? 'navigation__link_active' : ''}`}>Фильмы</Link>
              </li>
              <li className="navigation__link-item">
                <Link to="/saved-movies" className={`navigation__link ${matchSavedMovies ? 'navigation__link_active' : ''}`}>Сохранённые фильмы</Link>
              </li>
            </ul>
          </div>
          <Link to="/profile" className="navigation__link_profile">
            <img src={accountIcon} alt="Иконка профиля" className="navigation__icon_account" />Аккаунт</Link>
        </div>
      </div>
      <button className={`navigation__menu-btn ${isMenuOpen ? 'navigation__menu-btn_hidden' : ''}`} type="button" onClick={toggleMenu} />
    </nav>
  );
};

export default Navigation;