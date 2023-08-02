import { useMatch, Link } from 'react-router-dom';
import './NavTab.css';

const NavTab = () => {
  const matchSignup = useMatch("/signup");
  const matchSignin = useMatch("/signin");

  return (
    <nav className="navtab" aria-label="Авторизация">
      <Link to="/signup" className={`navtab__link_singup ${matchSignup ? 'navtab__link_signup_active' : ''}`}>Регистрация</Link>
      <Link to="/signin" className={`navtab__link_singin ${matchSignin ? 'navtab__link_signin_active' : ''}`}>Войти</Link>
    </nav>
  );
}

export default NavTab;