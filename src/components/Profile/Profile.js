import React, { useEffect, useState } from 'react';
import './Profile.css';
import { useNavigate } from 'react-router-dom';
import { getUser, updateUser, signout } from '../../utils/MainApi';
// В  разработке
const Profile = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      setName('Виталий');
      setEmail('pochta@yandex.ru');
    } else {
      getUser().then((userData) => {
        setName(userData.name);
        setEmail(userData.email);
      }).catch((error) => {
        console.log(error);
        setErrorMessage('При обновлении профиля произошла ошибка.');
      });
    }
  }, []);

  const handleEditButtonClick = (evt) => {
    evt.preventDefault();
    setIsEditing(true);
  };

  const handleSaveButtonClick = (evt) => {
    evt.preventDefault();
    setIsEditing(false);

    updateUser(email, name).then((updatedUserData) => {
      setName(updatedUserData.name);
      setEmail(updatedUserData.email);
    }).catch((error) => {
      console.log(error);
      if (error.message === 'Conflict') {
        setErrorMessage('Пользователь с таким email уже существует.');
      } else {
        setErrorMessage('При обновлении профиля произошла ошибка.');
      }
    });
  };

  const handleSignOut = () => {
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
          <h2 className="profile__title">Привет, Виталий!</h2>
          <div className="profile__input_area_name">
            <p className="profile__name">Имя</p>
            <input className="profile__input" type="text" placeholder="Введите имя"
              value={name} onChange={(e) => setName(e.target.value)} disabled={!isEditing} required />
          </div>
          <div className="profile__input_area_email">
            <p className="profile__email">E-mail</p>
            <input className="profile__input" type="email" placeholder="Введите Email"
              value={email} onChange={(e) => setEmail(e.target.value)} disabled={!isEditing} required />
          </div>
        </div>
        {isEditing ? (
          <div className="profile__btns">
            <button onClick={handleSaveButtonClick} className="profile__btn_save" type="submit">Сохранить</button>
          </div>
        ) : (
          <div className="profile__btns">
            {errorMessage && <p className="profile__error">{errorMessage}</p>}
            <button onClick={handleEditButtonClick} className="profile__btn_edit">Редактировать</button>
            <button className="profile__btn_escape" type="button" onClick={handleSignOut}>Выйти из аккаунта</button>
          </div>
        )}
      </form>
    </section>
  );
};

export default Profile;
