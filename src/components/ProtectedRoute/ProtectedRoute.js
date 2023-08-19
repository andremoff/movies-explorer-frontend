import { Navigate } from 'react-router-dom';

const withProtectedRoute = (Component) => {
  return function ProtectedRouteWrapper(props) {
    const { loggedIn, ...rest } = props;

    if (loggedIn) {
      return <Component {...rest} />;
    }
    return <Navigate to="/" />;
  };
};

export { withProtectedRoute };