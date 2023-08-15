import { Navigate } from 'react-router-dom';

// HOC для защиты маршрута
const withProtectedRoute = (Component) => {
  return function ProtectedRouteWrapper(props) {
    const { loggedIn, ...rest } = props;
    return loggedIn ? <Component {...rest} /> : <Navigate to="/" />;
  };
};

export { withProtectedRoute };