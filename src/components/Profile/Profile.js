import React, { useState, useEffect } from 'react';

import styles from '../css/styles.module.css';

const Profile = ({ user, onUpdate }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [image, setAvatar] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setUsername(user.username || '');
      setEmail(user.email || '');
      setAvatar(user.image || '');
    }
  }, [user]);

  const validate = () => {
    const errors = {};
    const urlPattern = /^(ftp|http|https):\/\/[^ "]+$/;

    if (newPassword && (newPassword.length < 6 || newPassword.length > 40)) {
      errors.password = 'Пароль должен быть от 6 до 40 символов';
    }
    if (image && !urlPattern.test(image)) {
      errors.image = 'Некорректный URL аватара';
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const userData = {
      username,
      email,
      ...(newPassword && { password: newPassword }),
      ...(image && { image }),
    };

    try {
      const response = await fetch('https://blog-platform.kata.academy/api/user', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ user: userData }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || 'Ошибка обновления профиля');
      }

      if (image) {
        localStorage.setItem('avatar', image);
      }

      onUpdate(responseData.user);
    } catch (err) {
      setErrors({ server: err.message });
    }
  };

  return (
    <div className={styles.w40}>
      <form onSubmit={handleSubmit}>
        <div className={styles.inpt}>
          <h1>Edit Profile</h1>
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="User Name"
            required
          />
        </div>

        {errors.server && <p style={{ color: 'red' }}>{errors.server}</p>}

        <div className={styles.inpt}>
          <label>Email address</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
        </div>

        <div className={styles.inpt}>
          <label>New password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Новый пароль"
          />
        </div>
        {errors.password && <p style={{ color: 'red' }}>{errors.password}</p>}

        <div className={styles.inpt}>
          <label>Avatar image (url)</label>
          <input type="text" value={image} onChange={(e) => setAvatar(e.target.value)} placeholder="URL аватара" />
        </div>

        {errors.image && <p style={{ color: 'red' }}>{errors.image}</p>}
        <div>
          <button className={styles.send} type="submit">
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
