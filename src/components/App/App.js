import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import { AuthProvider, useAuth } from '../AuthContext/AuthContext';
import ArticleList from '../ArticleList/ArticleList';
import Article from '../Article/Article';
import SignIn from '../SignIn/SignIn';
import SignUp from '../SignUp/SignUp';
import Profile from '../Profile/Profile';
import Header from '../Header/Header';
import CreateArticle from '../CreateArticle/CreateArticle';
import EditArticle from '../EditArticle/EditArticle';
import PrivateRoute from '../PrivateRoute/PrivateRoute';
import '../App/App.css';

const AppRoutes = () => {
  const { state, dispatch } = useAuth();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');

    if (token && username) {
      dispatch({ type: 'LOGIN', payload: { token, username } });
    }
  }, [dispatch]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    dispatch({ type: 'LOGOUT' });
  };

  const handleUserUpdate = (updatedUser) => {
    dispatch({ type: 'LOGIN', payload: updatedUser });
  };

  return (
    <>
      <Header user={state.username} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<ArticleList />} />
        <Route path="/articles" element={<ArticleList />} />
        <Route path="/articles/:slug" element={<Article />} />
        <Route path="/new-article" element={<PrivateRoute element={<CreateArticle />} />} />
        <Route path="/articles/:slug/edit" element={<PrivateRoute element={<EditArticle />} />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route
          path="/profile"
          element={<PrivateRoute element={<Profile user={state.username} onUpdate={handleUserUpdate} />} />}
        />
      </Routes>
    </>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
};

export default App;
