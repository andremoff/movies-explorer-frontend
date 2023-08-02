const baseURL = 'https://api.movies.andremoff.nomoredomains.xyz';

// Функция для обработки ответа от сервера
const checkResponse = (res) => {
  if (res.ok) {
    return res.json();
  }
  return res.json().then(err => Promise.reject(err));
};

//  Регистраця пользователя
const register = (email, password, name) =>
  fetch(`${baseURL}/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, password, name }),
  })
  .then(checkResponse);

// Авторизация пользователя
const login = (email, password) =>
  fetch(`${baseURL}/signin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, password }),
  }).then(checkResponse);

// Получение данных текущего пользователя
const getUser = () =>
  fetch(`${baseURL}/users/me`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  }).then(checkResponse);

//  Обновляем данные текущего пользователя
const updateUser = (email, name) =>
  fetch(`${baseURL}/users/me`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, name }),
  }).then(checkResponse);

// Получаем данные всех сохраненных фильмов пользователя
const getMovies = () =>
  fetch(`${baseURL}/movies`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  }).then(checkResponse);

// Создаем новый фильм
const createMovie = (movieData) =>
  fetch(`${baseURL}/movies`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(movieData),
  }).then(checkResponse);

// Удаляем фильм
const deleteMovie = (movieId) =>
  fetch(`${baseURL}/movies/${movieId}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  }).then(checkResponse);

// Выходим из аккаунта
const signout = () =>
  fetch(`${baseURL}/signout`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  }).then(checkResponse);

export {
  register,
  login,
  getUser,
  updateUser,
  getMovies,
  createMovie,
  deleteMovie,
  signout
}