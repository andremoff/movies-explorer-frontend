import { useContext, useEffect } from 'react';
import { CurrentUserContext } from '../components/contexts/CurrentUserContext';
import { useNavigate } from 'react-router-dom';

function useAuth(shouldBeAuthenticated) {
    const user = useContext(CurrentUserContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (shouldBeAuthenticated && !user) {
            navigate('/signin');
        } else if (!shouldBeAuthenticated && user) {
            navigate('/');
        }
    }, [user, shouldBeAuthenticated, navigate]);
}

export default useAuth;