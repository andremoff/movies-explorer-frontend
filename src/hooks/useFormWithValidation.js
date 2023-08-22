import React, { useCallback } from "react";

// хук управления формой
export function useForm() {
  const [values, setValues] = React.useState({});

  const handleChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    setValues({ ...values, [name]: value });
  };

  return { values, handleChange, setValues };
}

// хук управления формой и валидации формы
export function useFormWithValidation() {
  const [values, setValues] = React.useState({});
  const [errors, setErrors] = React.useState({});
  const [isValid, setIsValid] = React.useState(false);

  const handleServerError = (errorMessage, pageType) => {
    switch (pageType) {
      case "registration":
        setErrors({ ...errors, registration: errorMessage });
        break;
      case "login":
        setErrors({ ...errors, login: errorMessage });
        break;
      case "profileUpdate":
        setErrors({ ...errors, profileUpdate: errorMessage });
        break;
      default:
        setErrors({ ...errors, general: errorMessage });
    }
    setIsValid(false);
  };

  const handleChange = (event) => {
    const target = event.target;
    const name = target.name;
    const value = target.value;

    setValues({ ...values, [name]: value });

    // Валидация для поля name
    if (name === "name") {
      const namePattern = /^[A-Za-zА-Яа-я\s-]+$/;
      if (!namePattern.test(value) || value.length < 2) {
        setErrors({
          ...errors,
          [name]: 'Имя должно содержать только латиницу, кириллицу, пробел или дефис и быть не менее 2х символов'
        });
        setIsValid(false);
        return;
      }
    }

    // Валидация для поля email
    if (name === "email") {
      const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
      if (!emailPattern.test(value)) {
        setErrors({
          ...errors,
          [name]: 'Введите корректный адрес электронной почты'
        });
        setIsValid(false);
        return;
      }
    }

    // Валидация для поля password
    if (name === "password" && value.length < 6) {
      setErrors({ ...errors, [name]: 'Пароль должен содержать не менее 6 символов' });
      setIsValid(false);
      return;
    }

    setErrors({ ...errors, [name]: target.validationMessage });
    setIsValid(target.closest("form").checkValidity());
  };

  const resetForm = useCallback(
    (newValues = {}, newErrors = {}, newIsValid = false) => {
      setValues(newValues);
      setErrors(newErrors);
      setIsValid(newIsValid);
    },
    [setValues, setErrors, setIsValid]
  );

  return { values, handleChange, errors, isValid, resetForm, handleServerError, setValues };
}
