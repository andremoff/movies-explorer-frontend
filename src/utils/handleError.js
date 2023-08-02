export function handleError(err) {
  if (err.validation) {
    const fieldName = err.validation.body.keys[0];
    const errorMessage = err.validation.body.message;
    return { fieldName, errorMessage };
  }

  if (err.message) {
    let fieldName = '';
    switch (err.message) {
      case 'Вы ввели неправильный логин или пароль.':
        fieldName = 'password';
        break;
      case 'При авторизации произошла ошибка. Токен не передан или передан не в том формате.':
        fieldName = 'token';
        break;
      case 'При авторизации произошла ошибка. Переданный токен некорректен.':
        fieldName = 'token';
        break;
      case 'Пользователь с таким email уже существует.':
        fieldName = 'email';
        break;
      case 'При регистрации пользователя произошла ошибка.':
        fieldName = 'registration';
        break;
      default:
        fieldName = '';
    }
    return { fieldName, errorMessage: err.message };
  }

  return { fieldName: '', errorMessage: '' };
}

