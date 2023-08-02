import './Portfolio.css';
import porfolioIcon from '../../images/porfolio-icon.svg'

const Portfolio = () => {
  return (
    <section className="portfolio">
      <h2 className="portfolio__title">Портфолио</h2>
      <ul className="portfolio__list">
        <li className="portfolio__item">
          <a className="portfolio__link" href="https://github.com/andremoff/how-to-learn.git"
            target="_blank" rel="noopener noreferrer">
            Статичный сайт
            <img className="portfolio__icon" src={porfolioIcon} alt="иконка перехода" />
          </a>
        </li>
        <li className="portfolio__item">
          <a className="portfolio__link" href="https://github.com/andremoff/russian-travel.git"
            target="_blank" rel="noopener noreferrer">
            Адаптивный сайт
            <img className="portfolio__icon" src={porfolioIcon} alt="иконка перехода" />
          </a>
        </li>
        <li className="portfolio__item">
          <a className="portfolio__link" href="https://github.com/andremoff/react-mesto-api-full-gha.git"
            target="_blank" rel="noopener noreferrer">
            Одностраничное приложение
            <img className="portfolio__icon" src={porfolioIcon} alt="иконка перехода" />
          </a>
        </li>
      </ul>
    </section>
  );
};

export default Portfolio;
