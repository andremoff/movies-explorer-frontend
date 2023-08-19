import React, { useEffect, useState, useRef } from 'react';
import './Profile.css';
import { useNavigate } from 'react-router-dom';
import { getUser, updateUser, signout } from '../../utils/MainApi';
import { useFormWithValidation } from '../../hooks/useFormWithValidation';

const Profile = () => {

  // Навигация для переходов между страницами
  const navigate = useNavigate();

  // Стейты и функции для работы с формой (валидация, значения, ошибки и т.д.)
  const {
    values,
    handleChange,
    errors,
    isValid,
    resetForm,
    handleServerError
  } = useFormWithValidation();

  const [isEditing, setIsEditing] = useState(false);
  const [currentUser, setCurrentUser] = useState({ name: '', email: '' });
  const prevUserData = useRef({ name: '', email: '' });

  // Получение данных пользователя при монтировании компонента
  useEffect(() => {
    getUser().then((userData) => {
      // Проверка изменились ли данные пользователя
      const isUserDataChanged = !prevUserData.current ||
        prevUserData.current.name !== userData.data.name ||
        prevUserData.current.email !== userData.data.email;

      if (isUserDataChanged) {
        setCurrentUser({
          name: userData.data.name,
          email: userData.data.email
        });
        resetForm({
          name: userData.data.name,
          email: userData.data.email
        }, {}, true);

        prevUserData.current = {
          name: userData.data.name,
          email: userData.data.email
        };
      }

    }).catch((error) => {
      console.log(error);
      handleServerError('updateProfile', 'При обновлении профиля произошла ошибка.');
    });
  }, [resetForm, handleServerError]);

  // Активация режима редактирования
  const handleEditButtonClick = (evt) => {
    evt.preventDefault();
    setIsEditing(true);
  };

  // Сохранение изменений профиля
  const handleSaveButtonClick = (evt) => {
    evt.preventDefault();

    if (!isValid) return;

    updateUser(values.email, values.name).then((updatedUserData) => {
      setCurrentUser({
        name: updatedUserData.data.name,
        email: updatedUserData.data.email
      });
      resetForm({
        name: updatedUserData.data.name,
        email: updatedUserData.data.email
      }, {}, true);
      setIsEditing(false);
    }).catch((error) => {
      console.log(error);
      if (error.message === 'Conflict') {
        handleServerError('email', 'Пользователь с таким email уже существует.');
      } else {
        handleServerError('updateProfile', 'При обновлении профиля произошла ошибка.');
      }
    });
  };

  // Выход из профиля и переход на страницу входа
  const handleSignOut = () => {
    localStorage.removeItem('moviesTumbler');
    localStorage.removeItem('movies');
    localStorage.removeItem('moviesInputSearch');
    document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    signout().then(() => {
      navigate('/signin');
    }).catch((error) => {
      console.log(error);
    });
  };

  return (
    <section className="profile">
      <form className="profile__form">
        <div className="profile__info">
          <h2 className="profile__title">Привет, {currentUser.name}!</h2>
          <div className="profile__input-name">
            <p className="profile__name">Имя</p>
            <input className="profile__input"
              type="text"
              placeholder="Введите имя"
              name="name"
              value={isEditing ? values.name || '' : currentUser.name}
              onChange={handleChange}
              disabled={!isEditing}
              required />
          </div>
          <p className="profile__error">{errors.name}</p>
          <div className="profile__input-email">
            <p className="profile__email">E-mail</p>
            <input className="profile__input"
              type="email"
              placeholder="Введите Email"
              name="email"
              value={isEditing ? values.email || '' : currentUser.email}
              onChange={handleChange}
              disabled={!isEditing}
              required />
          </div>
          <p className="profile__error">{errors.email}</p>
        </div>
        {isEditing ? (
          <div className="profile__btns">
            <button onClick={handleSaveButtonClick} className="profile__btn-save" type="submit" disabled={!isValid}>Сохранить</button>
          </div>
        ) : (
          <div className="profile__btns">
            {errors.updateProfile && <p className="profile__error profile__error_active">{errors.updateProfile}</p>}
            <button onClick={handleEditButtonClick} className="profile__btn-edit">Редактировать</button>
            <button className="profile__btn-escape" type="button" onClick={handleSignOut}>Выйти из аккаунта</button>
          </div>
        )}
      </form>
    </section>
  );
};

export default Profile;
