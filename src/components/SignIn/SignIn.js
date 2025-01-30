import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import styles from '../css/styles.module.css';

const SignIn = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(formData.email)) {
      newErrors.email = 'Некорректный email';
    }
    if (formData.password.length < 6) {
      newErrors.password = 'Пароль должен быть не менее 6 символов';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const response = await fetch('https://blog-platform.kata.academy/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user: formData }),
      });

      const data = await response.json();
      console.log('Ответ от сервера:', data);

      if (!response.ok) {
        setErrors({ server: data.message || 'Ошибка при входе' });
      } else {
        localStorage.setItem('token', data.user.token);
        localStorage.setItem('username', data.user.username);

        console.log('Вход успешен:', data);
        navigate('/articles');
        window.location.reload();
      }
    } catch (error) {
      console.error('Ошибка во время входа:', error);
      setErrors({ server: 'Ошибка сети' });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <div className={styles.w40}>
      <form onSubmit={handleSubmit}>
        <div className={styles.inpt}>
          <h1>Sign In</h1>
          <label>Email address</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={errors.email ? styles.error : ''}
          />
          {errors.email && <span className={styles.err}>{errors.email}</span>}
        </div>

        <div className={styles.inpt}>
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={errors.password ? styles.error : ''}
          />
          {errors.password && <span className={styles.err}>{errors.password}</span>}
        </div>

        <button className={styles.send} type="submit">
          Login
        </button>
        {errors.server && <span className={styles.err}>{errors.server}</span>}
      </form>
    </div>
  );
};

export default SignIn;
