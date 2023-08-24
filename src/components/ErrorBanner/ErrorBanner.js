 level-3
import { useLocation, useNavigate } from 'react-router-dom';

import { Link } from 'react-router-dom';
 main
import './ErrorBanner.css';

const ErrorBanner = ({ customMessage }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const errorMessage = customMessage || queryParams.get('message') || 'Произошла неизвестная ошибка';

  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <div className="error-banner">
      <div className="error-banner__message">
        <h2 className="error-banner__code">404</h2>
        <p className="error-banner__text">{errorMessage}</p>
      </div>
      <button onClick={handleBackClick} className="error-banner__back">Назад</button>
    </div>
  );
};

export default ErrorBanner;
