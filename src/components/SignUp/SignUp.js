import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import useValidation from '../useHooks/useValidation';
import { registerUser } from '../Api/Api';
import styles from '../css/styles.module.css';

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    repeatPassword: '',
    agree: false,
  });

  const [errors, setErrors] = useState({});
  const { validate } = useValidation(formData, 'signUp'); // 'signUp'

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const data = await registerUser(formData);
      localStorage.setItem('token', data.token);
      console.log('Регистрация успешна:', data);
      navigate('/sign-in');
    } catch (error) {
      console.error('Ошибка во время регистрации:', error);
      setErrors({ server: 'измените данные' });
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  return (
    <div className={styles.w40}>
      <form onSubmit={handleSubmit}>
        <div className={styles.inpt}>
          <h1>Sign Up</h1>
          <label>Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className={errors.username ? styles.error : ''}
          />
          {errors.username && <span className={styles.err}>{errors.username}</span>}
        </div>

        <div className={styles.inpt}>
          <label>Email</label>
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

        <div className={styles.inpt}>
          <label>Repeat Password</label>
          <input
            type="password"
            name="repeatPassword"
            value={formData.repeatPassword}
            onChange={handleChange}
            className={errors.repeatPassword ? styles.error : ''}
          />
          {errors.repeatPassword && <span className={styles.err}>{errors.repeatPassword}</span>}
        </div>

        <div id="reg_input">
          <label></label>
          <input type="checkbox" name="agree" checked={formData.agree} onChange={handleChange} />I agree to the
          processing of my personal information
          {errors.agree && <span className={styles.err}>{errors.agree}</span>}
        </div>

        <button className={styles.send} type="submit">
          Create
        </button>

        {errors.server && <span className={styles.err}>{errors.server}</span>}
      </form>
    </div>
  );
};

export default SignUp;
