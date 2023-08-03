import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="footer__container">
        <h2 className="footer__title">Учебный проект Яндекс.Практикум х BeatFilm.</h2>
      </div>
      <nav className="footer__nav-container">
        <div className="footer__nav-item">
          <a className="footer__link" href="https://practicum.yandex.ru/" target="_blank" rel="noopener noreferrer">Яндекс.Практикум</a>
          <a className="footer__link" href="https://github.com/andremoff" target="_blank" rel="noopener noreferrer">Github</a>
        </div>
        <p className="footer__copyright">&copy; {currentYear}</p>
      </nav>
    </footer>
  );
};

export default Footer;