import './Header.css';
import { Link, useLocation } from 'react-router-dom';
import headerLogo from '../../images/header-logo.svg';
import NavAuth from '../NavTab/NavTab';
import Navigation from '../Navigation/Navigation';

const Header = ({ loggedIn, isLoading }) => {
  const { pathname } = useLocation();

  return (
    <header className={`header ${pathname !== '/' && 'header_type_auth'}
     ${pathname === '/profile' && 'header_type_white'}`}>
      <Link to="/" className="header__link">
        <img className="header__logo" src={headerLogo} alt="Логотип Movies Explorer" />
      </Link>
      {!isLoading && (loggedIn ? <Navigation /> : <NavAuth />)}
    </header>
  );
};

export default Header;
