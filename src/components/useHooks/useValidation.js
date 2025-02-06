import { useState } from 'react';

const useValidation = (formData, formType) => {
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const urlPattern = /^(ftp|http|https):\/\/[^ "]+$/;

    // Валидация email
    if (!formData.email || formData.email.trim() === '') {
      newErrors.email = 'Email не может быть пустым';
    } else if (!emailPattern.test(formData.email)) {
      newErrors.email = 'Некорректный email';
    }
    if (formType === 'signIn') {
      // Валидация для входа
      if (!formData.password || formData.password.length < 6) {
        newErrors.password = 'Пароль должен быть не менее 6 символов';
      }
    } else if (formType === 'signUp') {
      // Валидация для регистрации
      if (!formData.username || formData.username.length < 3 || formData.username.length > 20) {
        newErrors.username = 'Имя пользователя должно быть от 3 до 20 символов';
      }
      if (!formData.password || formData.password.length < 6 || formData.password.length > 40) {
        newErrors.password = 'Пароль должен быть от 6 до 40 символов';
      }
      if (formData.password !== formData.repeatPassword) {
        newErrors.repeatPassword = 'Пароли должны совпадать';
      }
      if (!formData.agree) {
        newErrors.agree = 'Необходимо согласие на обработку персональных данных';
      }
    } else if (formType === 'profile') {
      // Валидация для профиля
      if (!formData.username || formData.username.length < 3 || formData.username.length > 20) {
        newErrors.username = 'Имя пользователя должно быть от 3 до 20 символов';
      }
      if (formData.newPassword && (formData.newPassword.length < 6 || formData.newPassword.length > 40)) {
        newErrors.password = 'Пароль должен быть от 6 до 40 символов';
      }
      if (formData.image && !urlPattern.test(formData.image)) {
        newErrors.image = 'Некорректный URL аватара';
      }
    }

    setErrors(newErrors);
    return newErrors;
  };

  // !!!!!
  const ValidateArticle = () => {
    const newErrors = {};

    if (!formData.title) {
      newErrors.title = 'Заголовок обязателен';
    }
    if (!formData.description) {
      newErrors.description = 'Описание обязательно';
    }
    if (!formData.body) {
      newErrors.body = 'Содержимое обязательно';
    }
    if (formData.tagList.length > 3) {
      newErrors.tags = 'Максимум 3 тега';
    }
    formData.tagList.forEach((tag) => {
      if (tag.length > 7) {
        newErrors.tags = 'Теги не должны превышать 7 символов';
      }
    });

    return newErrors;
  };

  return { ValidateArticle, validate, errors, setErrors };
};

export default useValidation;
