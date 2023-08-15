import { Link, useLocation } from 'react-router-dom';
import './ErrorBanner.css';

const ErrorBanner = ({ customMessage }) => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const errorMessage = customMessage || queryParams.get('message') || 'Произошла неизвестная ошибка';

  return (
    <div className="error-banner">
      <div className="error-banner__message">
        <h2 className="error-banner__code">404</h2>
        <p className="error-banner__text">{errorMessage}</p>
      </div>
      <Link to="/" className="error-banner__back">Назад</Link>
    </div>
  );
};

export default ErrorBanner;
