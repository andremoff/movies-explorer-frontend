import React, { useState, useEffect, useContext } from 'react';
import './Profile.css';
import { updateUser } from '../../utils/MainApi';
import { useFormWithValidation } from '../../hooks/useFormWithValidation';
import { CurrentUserContext } from '../contexts/CurrentUserContext';

const Profile = ({ openPopup, onSignOut }) => {
  const { currentUser, updateCurrentUser } = useContext(CurrentUserContext);
  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);

  // Отслеживайте изменения currentUser и обновляйте локальное состояние
  useEffect(() => {
    setName(currentUser.name);
    setEmail(currentUser.email);
  }, [currentUser]);

  const {
    values,
    handleChange,
    errors,
    isValid,
    handleServerError,
    setValues
  } = useFormWithValidation();

  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Проверка на изменение данных
  const hasDataChanged = () => {
    return values.name !== name || values.email !== email;
  };

  // Обработчик для кнопки редактирования
  const handleEditButtonClick = (evt) => {
    evt.preventDefault();
    setValues({
      name: currentUser.name,
      email: currentUser.email
    });
    setIsEditing(true);
  };

  // Обработчик для кнопки редактирования
  const handleSaveButtonClick = (evt) => {
    evt.preventDefault();

    if (!isValid || !hasDataChanged()) return;

    setIsSubmitting(true);
    // Отправка обновленных данных пользователя
    updateUser(values.email, values.name)
      .then((updatedUserData) => {
        updateCurrentUser(updatedUserData.data);
        setName(updatedUserData.data.name);
        setEmail(updatedUserData.data.email);
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
 level-3
          <h2 className="profile__title">Привет, {name}!</h2>

          <h2 className="profile__title">Привет, Виталий!</h2>
 main
          <div className="profile__input-name">
            <p className="profile__name">Имя</p>
            <input className="profile__input"
              type="text"
              placeholder="Введите имя"
              name="name"
              value={isEditing ? values.name || '' : name}
              onChange={handleChange}
              disabled={!isEditing || isSubmitting}
              required />
          </div>
 level-3
          <p className="profile__error">{errors.name}</p>

 main
          <div className="profile__input-email">
            <p className="profile__email">E-mail</p>
            <input className="profile__input"
              type="email"
              placeholder="Введите Email"
              name="email"
              value={isEditing ? values.email || '' : email}
              onChange={handleChange}
              disabled={!isEditing || isSubmitting}
              required />
          </div>
          <p className="profile__error">{errors.email}</p>
        </div>
        {isEditing ? (
          <div className="profile__btns">
 level-3
            <button onClick={handleSaveButtonClick} className="profile__btn-save" type="submit" disabled={!isValid || !hasDataChanged() || isSubmitting}>Сохранить</button>
          </div>
        ) : (
          <div className="profile__btns">
            {errors.updateProfile && <p className="profile__error profile__error_active">{errors.updateProfile}</p>}
            <button onClick={handleEditButtonClick} className="profile__btn-edit" disabled={isSubmitting}>Редактировать</button>
            <button className="profile__btn-escape" type="button" onClick={onSignOut} disabled={isSubmitting}>Выйти из аккаунта</button>

            <button onClick={handleSaveButtonClick} className="profile__btn-save" type="submit">Сохранить</button>
          </div>
        ) : (
          <div className="profile__btns">
            {errorMessage && <p className="profile__error">{errorMessage}</p>}
            <button onClick={handleEditButtonClick} className="profile__btn-edit">Редактировать</button>
            <button className="profile__btn-escape" type="button" onClick={handleSignOut}>Выйти из аккаунта</button>
 main
          </div>
        )}
      </form>
    </section>
  );
};

export default Profile;