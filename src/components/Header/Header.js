import './Header.css';
import { Link, useLocation } from 'react-router-dom';
import headerLogo from '../../images/header-logo.svg';
import Navigation from '../Navigation/Navigation';
import NavTab from '../NavTab/NavTab';
import { useEffect } from 'react';

const Header = ({ loggedIn, isLoading, onHeaderUpdate }) => {
  const { pathname } = useLocation();

  // Обновляем header при смене loggedIn
  useEffect(() => {
    onHeaderUpdate();
  }, [loggedIn, onHeaderUpdate]);

  return (
    <header className={`header ${pathname !== '/' && 'header_type_auth'}
     ${pathname === '/profile' && 'header_type_white'}`}>
      <Link to="/" className="header__link">
        <img className="header__logo" src={headerLogo} alt="Логотип Movies Explorer" />
      </Link>
      {!isLoading && (loggedIn ? <Navigation /> : <NavTab />)}
    </header>
  );
};

export default Header;
