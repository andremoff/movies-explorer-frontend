class MoviesApi {
  constructor(config) {
    this._address = config.address;
    this._headers = config.headers;
  }

  // Метод для проверки ответа от сервера.
  _checkResponse(res) {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(`Ошибка: ${res.status}`);
  }

  // Метод для получения списка фильмов.
  getMovies() {
    return fetch(`${this._address}/beatfilm-movies`, {
      method: 'GET',
      headers: this._headers,
    }).then(this._checkResponse);
  }
}

// Базовый адрес сервера и заголовки для запросов.
const moviesApiConfig = {
  address: 'https://api.nomoreparties.co',
  headers: {
    'Content-Type': 'application/json',
  },
};

// Инициализация экземпляра класса MoviesApi с заданными настройками.
const moviesApi = new MoviesApi(moviesApiConfig);

export default moviesApi;
