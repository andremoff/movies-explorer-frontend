import React from 'react';
import './Login.css';
import loginLogo from '../../images/header-logo.svg';
import { NavLink, useNavigate } from 'react-router-dom';
import { useFormWithValidation } from '../../hooks/useFormWithValidation';

const Login = ({ onLogin, openPopup, closePopup }) => {
  const navigate = useNavigate();
  const {
    values,
    handleChange,
    errors,
    isValid,
    handleServerError
  } = useFormWithValidation();

  // Обработчик отправки формы
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onLogin(values.email, values.password);
      openPopup("Вход выполнен успешно");
      setTimeout(() => {
        closePopup();
      }, 2000);
      navigate('/movies');
    } catch (err) {
      handleServerError(err.message, "registration");
      openPopup("Что-то пошло не так");
    }
  };

  return (
    <div className="login">
      <form className="login__form" onSubmit={handleSubmit}>
        <div className="login__container">
          <NavLink to="/" className="login__logo-link">
            <img className="login__logo" src={loginLogo} alt="Логотип регистрации"></img>
          </NavLink>
          <h2 className="login__title">Рады видеть!</h2>
          <p className="login__input-title">E-mail</p>
 level-3
          <input
            name="email"
            className={`login__input ${errors.email && 'login__input_error'}`}

          <input className={`login__input ${emailError && 'login__input_error'}`}
 main
            type="email"
            placeholder="Введите E-mail"
            value={values.email || ""}
            onChange={handleChange}
            required>
          </input>
          <p className="login__error">{errors.email}</p>

          <p className="login__input-title">Пароль</p>
 level-3
          <input
            name="password"
            className={`login__input ${errors.password && 'login__input_error'}`}

          <input className={`login__input ${passwordError && 'login__input_error'}`}
 main
            type="password"
            placeholder="Введите пароль"
            value={values.password || ""}
            onChange={handleChange}
            required>
          </input>
          <p className="login__error">{errors.password}</p>
        </div>
        <div className="login__btn-container">
          {errors.token && <p className="login__error login__error_active">{errors.token}</p>}
          <button className="login__button" type="submit" disabled={!isValid}>Войти</button>
          <p className="login__text">
            Ещё не зарегистрированы?
            <NavLink className="login__link" to="/signup">Регистрация</NavLink>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;
