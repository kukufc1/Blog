import React from 'react';
import { Link } from 'react-router-dom';

import { useAuth } from '../AuthContext/AuthContext';
import '../Header/Header.css';

const Header = () => {
  const { state, dispatch } = useAuth();
  const { user } = state;

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <header>
      <nav>
        <div className="nav__link">
          <Link to="/articles">Realworld Blog</Link>
        </div>
        {user ? (
          <div className="nav__profile">
            <button className="profile__crtArticle">
              <Link to="/new-article">Create Article</Link>
            </button>
            <Link to="/profile">
              <h1>{user.username}</h1>
            </Link>
            {user.image && (
              <Link to="/profile">
                <img
                  src={user.image}
                  alt="Avatar"
                  style={{ width: '55px', height: '55px', borderRadius: '50%', cursor: 'pointer' }}
                />
              </Link>
            )}
            <Link to="/">
              <button className="profile__logOut" onClick={handleLogout}>
                Log Out
              </button>
            </Link>
          </div>
        ) : (
          <div className="nav__authorized">
            <Link to="/sign-in">Sign In</Link>
            <Link to="/sign-up">Sign Up</Link>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
