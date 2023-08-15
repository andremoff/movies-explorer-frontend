import './App.css';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import Main from '../Main/Main';
import Profile from '../Profile/Profile';
import Register from '../Register/Register';
import Login from '../Login/Login';
import Movies from '../Movies/Movies';
import SavedMovies from '../SavedMovies/SavedMovies';
import { getUser, register, login } from '../../utils/MainApi';
import ErrorBanner from '../ErrorBanner/ErrorBanner';
import { withProtectedRoute } from '../ProtectedRoute/ProtectedRoute';
import Popup from '../Popup/Popup';

// Применяем HOC
const ProtectedProfile = withProtectedRoute(Profile);
const ProtectedMovies = withProtectedRoute(Movies);
const ProtectedSavedMovies = withProtectedRoute(SavedMovies);

function InnerApp() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  const { pathname } = useLocation();
  const [isOpenPopup, setIsOpenPopup] = useState(false);
  const [popupTitle, setPopupTitle] = useState('');

  const handleRegister = (email, password, name) => {
    return register(email, password, name)
      .then((res) => {
        if (res) {
          setLoggedIn(true);
          setCurrentUser(res);
          return res;
        }
      })
  };

  const handleLogin = (email, password) => {
    return login(email, password)
      .then((res) => {
        if (res) {
          setLoggedIn(true);
          setCurrentUser(res);
          return res;
        }
      })
  };

  const getUserInfo = () => {
    getUser()
      .then((res) => {
        setCurrentUser(res);
        setLoggedIn(true);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  function openPopup(textError) {
    setPopupTitle(textError);
    setIsOpenPopup(true);
  }

  function closePopup() {
    setIsOpenPopup(false);
    setPopupTitle('');
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>

      <div className='App'>
        {pathname === '/' || pathname === '/movies' || pathname === '/saved-movies' || pathname === '/profile' ?
          <Header loggedIn={loggedIn} key={loggedIn} /> : ''}

        <main>
          <Routes>
            <Route path='/' element={<Main />} />
            <Route path='/signin' element={<Login onLogin={handleLogin} openPopup={openPopup} closePopup={closePopup} />} />
            <Route path='/signup' element={<Register onRegister={handleRegister} />} />
            <Route path='/profile' element={<ProtectedProfile loggedIn={loggedIn} user={currentUser} />} />
            <Route path='/movies' element={<ProtectedMovies loggedIn={loggedIn} openPopup={openPopup} />} />
            <Route path='/saved-movies' element={<ProtectedSavedMovies loggedIn={loggedIn} openPopup={openPopup} />} />
            <Route path='/error' element={<ErrorBanner />} /> {/* Добавленный маршрут */}
            <Route path='*' element={<ErrorBanner />} />
          </Routes>
        </main>

        {pathname === '/' || pathname === '/movies' || pathname === '/saved-movies' ? <Footer /> : ''}

        <Popup text={popupTitle} isOpen={isOpenPopup} onClose={closePopup} />
      </div>

    </CurrentUserContext.Provider>
  );
};

function App() {
  return (
    <Router>
      <InnerApp />
    </Router>
  );
}

export default App;
