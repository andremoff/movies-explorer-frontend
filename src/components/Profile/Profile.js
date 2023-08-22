import React, { useState, useEffect } from 'react';
import './Profile.css';
import { updateUser } from '../../utils/MainApi';
import { useFormWithValidation } from '../../hooks/useFormWithValidation';

const Profile = ({ openPopup, onSignOut, user }) => {

  const {
    values,
    handleChange,
    errors,
    isValid,
    handleServerError,
    setValues
  } = useFormWithValidation();

  const [isEditing, setIsEditing] = useState(false);
  const [currentUser, setCurrentUser] = useState({ name: '', email: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

 // Обновление данных текущего пользователя при изменении пропса user
  useEffect(() => {
    setCurrentUser({
      name: user.name,
      email: user.email
    });
  }, [user]);

  // Проверка, изменились ли данные формы
  const hasDataChanged = () => {
    return values.name !== currentUser.name || values.email !== currentUser.email;
  };

  // Обработчик кнопки редактирования профиля
  const handleEditButtonClick = (evt) => {
    evt.preventDefault();
    setValues({
      name: currentUser.name,
      email: currentUser.email
    });
    setIsEditing(true);
  };

  // Обработчик кнопки сохранения изменений профиля
  const handleSaveButtonClick = (evt) => {
    evt.preventDefault();

    if (!isValid || !hasDataChanged()) return;

    setIsSubmitting(true);
// Обновление профиля через API
    updateUser(values.email, values.name)
      .then((updatedUserData) => {
        setCurrentUser({
          name: updatedUserData.data.name,
          email: updatedUserData.data.email
        });
        setIsEditing(false);
        openPopup('Данные успешно обновлены!');
      })
      .catch((error) => {
        if (error.message === 'Conflict') {
          handleServerError('email', 'Пользователь с таким email уже существует.');
          openPopup('Пользователь с таким email уже существует.');
        } else {
          handleServerError('updateProfile', 'При обновлении профиля произошла ошибка.');
          openPopup('При обновлении профиля произошла ошибка.');
        }
      })
      .finally(() => {
        setIsSubmitting(false);
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
              disabled={!isEditing || isSubmitting}
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
              disabled={!isEditing || isSubmitting}
              required />
          </div>
          <p className="profile__error">{errors.email}</p>
        </div>
        {isEditing ? (
          <div className="profile__btns">
            <button onClick={handleSaveButtonClick} className="profile__btn-save" type="submit" disabled={!isValid || !hasDataChanged() || isSubmitting}>Сохранить</button>
          </div>
        ) : (
          <div className="profile__btns">
            {errors.updateProfile && <p className="profile__error profile__error_active">{errors.updateProfile}</p>}
            <button onClick={handleEditButtonClick} className="profile__btn-edit" disabled={isSubmitting}>Редактировать</button>
            <button className="profile__btn-escape" type="button" onClick={onSignOut} disabled={isSubmitting}>Выйти из аккаунта</button>
          </div>
        )}
      </form>
    </section>
  );
};

export default Profile;
