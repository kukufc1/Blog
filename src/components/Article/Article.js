import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

import { useAuth } from '../AuthContext/AuthContext'; // Импортируйте useAuth
import { fetchArticle, deleteArticle, toggleFavorite } from '../Api/Api';
import '../Article/Article.css';
import Modal from '../Modal/Modal';

const Article = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { state } = useAuth(); // Получаем состояние аутентификации
  const token = state.user?.token; // Получаем токен
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isFavorited, setIsFavorited] = useState();

  const handleToggleFavorite = async () => {
    try {
      const data = await toggleFavorite(slug, isFavorited, token);
      setIsFavorited(data.article.favorited);
      window.location.reload();
    } catch (err) {
      console.error('Ошибка при изменении статуса лайка:', err);
      setError('Ошибка при изменении статуса лайка.');
    }
  };

  useEffect(() => {
    const loadArticle = async () => {
      setLoading(true);
      try {
        const data = await fetchArticle(slug, token);
        setArticle(data.article);
        setIsFavorited(data.article.favorited);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadArticle();
  }, [slug, token]);

  const handleEdit = () => {
    navigate(`/articles/${slug}/edit`);
  };

  const handleDelete = async () => {
    setModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteArticle(slug, token);
      navigate('/articles');
    } catch (err) {
      console.error('Ошибка при удалении статьи:', err);
      setError('Ошибка при удалении статьи.');
    } finally {
      setModalOpen(false);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {error}</div>;
  if (!article) return <div>Статья не найдена.</div>;

  return (
    <div className="card">
      <div className="card__flex">
        <div className="card__title">
          <div className="card__likes">
            <h1>{article.title}</h1>
            <div className="favorite" onClick={handleToggleFavorite} style={{ cursor: 'pointer' }}>
              <p>💜 {article.favoritesCount} </p>
            </div>
          </div>

          {article.tagList && article.tagList.length > 0 && (
            <ul className="list_tags tags__card">
              <div>
                <ul className="list__tags">
                  {article.tagList.slice(0, 3).map((tag, index) => (
                    <li key={index}>
                      <a id="tags__a" href="#">
                        {tag}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </ul>
          )}
          <p>{article.description}</p>
        </div>
        <div className="card__author">
          <div className="card__author__flex">
            <div className="card__author__info">
              <span>{article.author ? article.author.username : 'Неизвестен'}</span>
              <p>
                {new Date(article.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
            <div className="card__author__img">
              <img src={article.author.image} alt={article.title} />
            </div>
          </div>
          <div className="author__btn__flex">
            <button id="author__btn__del" onClick={handleDelete}>
              Delete
            </button>{' '}
            <button id="author__btn__edit" onClick={handleEdit}>
              Edit
            </button>{' '}
            <Modal isOpen={isModalOpen} onClose={closeModal} onConfirm={confirmDelete} />
          </div>
        </div>
      </div>
      <div className="text">
        <ReactMarkdown>{article.body}</ReactMarkdown>
      </div>
    </div>
  );
};

export default Article;
