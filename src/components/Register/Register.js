import React, { useState } from 'react';
import './Register.css';
import registerLogo from '../../images/header-logo.svg';
import { NavLink, useNavigate } from 'react-router-dom';
import { handleError } from '../../utils/handleError';

const Register = ({ onRegister }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onRegister(email, password, name);
      navigate('/signin');
    } catch (err) {
      const { fieldName, errorMessage } = handleError(err);

      switch (fieldName) {
        case 'name':
          setNameError(errorMessage);
          break;
        case 'email':
          setEmailError(errorMessage);
          break;
        case 'password':
          setPasswordError(errorMessage);
          break;
        case 'registration':
          setNameError('');
          setEmailError('');
          setPasswordError('При регистрации пользователя произошла ошибка.');
          break;
        default:
          setNameError('');
          setEmailError('');
          setPasswordError('');
      }
    }
  };

  return (
    <section className="register">
      <form className="register__form" onSubmit={handleSubmit}>
        <div className="register__container">
          <NavLink to="/" className="register__logo-link">
            <img className="register__logo" src={registerLogo} alt="Логотип регистрации"></img>
          </NavLink>
          <h2 className="register__title">Добро пожаловать!</h2>
          <p className="register__input-title">Имя</p>
          <input
            className={`register__input ${nameError && 'register__input_error'}`}
            type="text"
            placeholder="Введите имя"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required>
          </input>
          <p className="register__error">{nameError}</p>
          <p className="register__input-title">E-mail</p>
          <input
            className={`register__input ${emailError && 'register__input_error'}`}
            type="email"
            placeholder="Введите E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required>
          </input>
          <p className="register__error">{emailError}</p>
          <p className="register__input-title">Пароль</p>
          <input
            className={`register__input ${passwordError && 'register__input_error'}`}
            type="password" placeholder="Введите пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required>
          </input>
          <p className="register__error">{passwordError}</p>
        </div>
        <div className="register__btn-container">
          <button
            className="register__button"
            type="submit">
            Зарегистрироваться
          </button>
          <p
            className="register__text">
            Уже зарегистрированы?
            <NavLink
              className="register__link"
              to="/signin">
              Войти
            </NavLink>
          </p>
        </div>
      </form>
    </section>
  );
};

export default Register;
