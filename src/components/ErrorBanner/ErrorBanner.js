import { Link } from 'react-router-dom';
import './ErrorBanner.css';

const ErrorBanner = () => {
  return (
    <div className="error-banner">
      <div className="error-banner__message">
        <h2 className="error-banner__code">404</h2>
        <p className="error-banner__text">Страница не найдена</p>
      </div>
      <Link to="/" className="error-banner__back">Назад</Link>
    </div>
  );
};

export default ErrorBanner;
