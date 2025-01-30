import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import ArticleList from '../ArticleList/ArticleList';
import Article from '../Article/Article';
import SignIn from '../SignIn/SignIn';
import SignUp from '../SignUp/SignUp';
import Profile from '../Profile/Profile';
import Header from '../Header/Header';
import CreateArticle from '../CreateArticle/CreateArticle';
import EditArticle from '../EditArticle/EditArticle';
import '../App/App.css';

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    if (token && username) {
      setUser({ username });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setUser(null);
  };

  const handleUserUpdate = (updatedUser) => {
    setUser(updatedUser);
  };

  return (
    <Router>
      <Header user={user} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<ArticleList />} />
        <Route path="/articles" element={<ArticleList />} />
        <Route path="/articles/:slug" element={<Article />} />
        <Route path="/new-article" element={<CreateArticle />} />
        <Route path="/articles/:slug/edit" element={<EditArticle />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/profile" element={<Profile user={user} onUpdate={handleUserUpdate} />} />{' '}
      </Routes>
    </Router>
  );
};

export default App;
