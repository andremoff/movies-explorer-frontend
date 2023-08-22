import './App.css';
import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import { getUser, register, login } from '../../utils/MainApi';
import { signout } from '../../utils/MainApi';
import Header from '../Header/Header';
import Main from '../Main/Main';
import Footer from '../Footer/Footer';
import Register from '../Register/Register';
import Login from '../Login/Login';
import Profile from '../Profile/Profile';
import Movies from '../Movies/Movies';
import SavedMovies from '../SavedMovies/SavedMovies';
import ErrorBanner from '../ErrorBanner/ErrorBanner';
import Popup from '../Popup/Popup';
import { withProtectedRoute } from '../ProtectedRoute/ProtectedRoute';

function InnerApp() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  const { pathname } = useLocation();
  const [isOpenPopup, setIsOpenPopup] = useState(false);
  const [popupTitle, setPopupTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const updateCurrentUser = (userData) => {
    setCurrentUser(prevUser => ({ ...prevUser, ...userData }));
  };
  const navigate = useNavigate();

  // Обработчик регистрации пользователя
  const handleRegister = (email, password, name) => {
    return register(email, password, name)
      .then((res) => {
        if (res) {
          // После успешной регистрации авторизуем пользователя
          return handleLogin(email, password)
            .then((loginRes) => {
              if (loginRes) {
                setLoggedIn(true);
                setCurrentUser(loginRes);
                return loginRes;
              }
            });
        }
      });
  };

  // Обработчик входа пользователя
  const handleLogin = (email, password) => {
    return login(email, password)
      .then((res) => {
        if (res) {
          setLoggedIn(true);
          setCurrentUser(res.data);
          return res;
        }
      });
  };

  // Получение данных текущего пользователя
  const getUserInfo = () => {
    getUser()
      .then((res) => {
        setCurrentUser(res.data);
        setLoggedIn(true);
      })
      .catch((err) => {
        // Для возможной обработки ошибки
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Вызов функции getUserInfo при монтировании компонента
  useEffect(() => {
    getUserInfo();
  }, []);

  //Выход пользователя
  const handleSignOut = () => {
    localStorage.removeItem('moviesTumbler');
    localStorage.removeItem('movies');
    localStorage.removeItem('moviesInputSearch');
    document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    signout().then(() => {
      setLoggedIn(false);
      openPopup('Выход из аккаунта выполнен');
      setTimeout(() => {
        closePopup();
        navigate('/');
      }, 1000);
    }).catch(() => {
      openPopup('Что-то пошло не так. Пожалуйста, попробуйте позже.');
    });
  };

  // Открыть модальное окно с ошибкой
  const openPopup = useCallback((textError) => {
    setPopupTitle(textError);
    setIsOpenPopup(true);
  }, []);

  // Закрыть модальное окно
  const closePopup = () => {
    setIsOpenPopup(false);
    setPopupTitle('');
  };

  // Переадресация
  if (loggedIn && (pathname === '/signin' || pathname === '/signup')) {
    navigate('/movies', { replace: true });
  }

  return (
    <CurrentUserContext.Provider value={{ currentUser, updateCurrentUser }}>
      <div className='App'>
        {pathname === '/' || pathname === '/movies' || pathname === '/saved-movies' || pathname === '/profile' ?
          <Header loggedIn={loggedIn} /> : ''}

        <main>
          <Routes>
            <Route path='/' element={<Main />} />
            <Route path='/signin' element={loggedIn ? null : <Login onLogin={handleLogin} openPopup={openPopup} closePopup={closePopup} />} />
            <Route path='/signup' element={loggedIn ? null : <Register onRegister={handleRegister} openPopup={openPopup} closePopup={closePopup} />} />
            <Route path='/profile' element={withProtectedRoute(Profile)({ loggedIn, loading, openPopup, closePopup, onSignOut: handleSignOut })} />
            <Route path='/movies' element={withProtectedRoute(Movies)({ loggedIn, loading, user: currentUser, openPopup })} />
            <Route path='/saved-movies' element={withProtectedRoute(SavedMovies)({ loggedIn, loading, user: currentUser, openPopup })} />

            <Route path='/error' element={<ErrorBanner />} />
            <Route path='*' element={<ErrorBanner />} />
          </Routes>
        </main>

        {pathname === '/' || pathname === '/movies' || pathname === '/saved-movies' ? <Footer /> : ''}

        <Popup text={popupTitle} isOpen={isOpenPopup} onClose={closePopup} />
      </div>
    </CurrentUserContext.Provider>
  );
}

function App() {
  return (
    <Router>
      <InnerApp />
    </Router>
  );
}

export default App;
