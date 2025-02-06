import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../AuthContext/AuthContext';
import { updateUserProfile } from '../Api/Api';
import useValidation from '../useHooks/useValidation';
import styles from '../css/styles.module.css';

const Profile = ({ onUpdate }) => {
  const navigate = useNavigate();

  const { state } = useAuth();
  const { user } = state;

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [image, setAvatar] = useState('');

  useEffect(() => {
    if (user) {
      setUsername(user.username || '');
      setEmail(user.email || '');
      setAvatar(user.image || '');
    }
  }, [user]);

  const formData = {
    username,
    email,
    newPassword,
    image,
  };

  const [errors, setErrors] = useState({});
  const { validate } = useValidation(formData, 'profile');

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
      const token = user.token;
      const responseData = await updateUserProfile(userData, token);

      onUpdate(responseData.user);
      navigate('/articles');
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
            className={errors.username ? styles.error : ''}
          />
        </div>

        {errors.username && <span className={styles.err}>{errors.username}</span>}

        <div className={styles.inpt}>
          <label>Email address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className={errors.email ? styles.error : ''}
          />
        </div>
        {errors.email && <span className={styles.err}>{errors.email}</span>}

        <div className={styles.inpt}>
          <label>New password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Новый пароль"
            className={errors.password ? styles.error : ''}
          />
        </div>
        {errors.password && <span className={styles.err}>{errors.password}</span>}

        <div className={styles.inpt}>
          <label>Avatar image (url)</label>
          <input
            type="text"
            value={image}
            onChange={(e) => setAvatar(e.target.value)}
            placeholder="URL аватара"
            className={errors.image ? styles.error : ''}
          />
          {errors.image && <span className={styles.err}>{errors.image}</span>}
        </div>

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
