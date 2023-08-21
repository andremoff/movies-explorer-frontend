import { Navigate } from 'react-router-dom';
import Preloader from '../Preloader/Preloader';

const withProtectedRoute = (Component) => {
  return function ProtectedRouteWrapper(props) {
    const { loggedIn, loading, ...rest } = props;

    if (loading) {
      return <Preloader />;
    }

    if (loggedIn) {
      return <Component {...rest} />;
    }
    return <Navigate to="/" />;
  };
};

export { withProtectedRoute };