import { useMatch, Link } from 'react-router-dom';
import './NavTab.css';

const NavTab = () => {
  const matchSignup = useMatch("/signup");
  const matchSignin = useMatch("/signin");

  return (
    <nav className="navtab" aria-label="Авторизация">
      <Link to="/signup" className={`navtab__link-signup ${matchSignup ? 'navtab__link-signup_active' : ''}`}>Регистрация</Link>
      <Link to="/signin" className={`navtab__link-signin ${matchSignin ? 'navtab__link-signin_active' : ''}`}>Войти</Link>
    </nav>
  );
}

export default NavTab;