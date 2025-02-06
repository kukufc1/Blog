import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { useAuth } from '../AuthContext/AuthContext'; // Импортируйте useAuth
import { fetchEditArticle, updatedEditArticle } from '../Api/Api';
import '../EditArticle/EditArticle.css';

const EditArticle = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { state } = useAuth(); // Получаем состояние из контекста
  const token = state.user?.token; // Получаем токен из состояния
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [body, setBody] = useState('');
  const [tags, setTags] = useState(['']);

  const loadArticle = async () => {
    setLoading(true);
    try {
      const articleData = await fetchEditArticle(slug, token);
      setArticle(articleData);
      setTitle(articleData.title);
      setDescription(articleData.description);
      setBody(articleData.body);
      setTags(articleData.tagList.length > 0 ? articleData.tagList : ['']);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadArticle();
  }, [slug]);

  const handleTagChange = (index, value) => {
    const newTags = [...tags];
    newTags[index] = value;
    setTags(newTags);
  };

  const addTag = () => {
    setTags([...tags, '']);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const articlePayload = {
      article: {
        title,
        description,
        body,
        tagList: tags.filter(Boolean),
      },
    };

    console.log('Отправляем на сервер:', articlePayload);

    try {
      const updatedArticle = await updatedEditArticle(slug, articlePayload, token);
      console.log('Статья обновлена:', updatedArticle);
      navigate('/articles');
    } catch (err) {
      console.error('Ошибка при обновлении статьи:', err);
      setError(err.message);
    }
  };

  const clearTag = (index) => {
    const newTags = tags.filter((_, idx) => idx !== index);
    setTags(newTags);
  };

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {error}</div>;
  if (!article) return <div>Статья не найдена.</div>;

  return (
    <div className="edit__article">
      <h1>Edit article</h1>
      <form onSubmit={handleSubmit}>
        <div className="edit__article__title">
          <label>Title</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div className="edit__article__description">
          <label>Short description</label>
          <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} required />
        </div>
        <div className="edit__article__text">
          <label>Text</label>
          <textarea value={body} onChange={(e) => setBody(e.target.value)} required />
        </div>
        <div className="edit__article__tags">
          <div id="edit__tags__form">
            <h2>Tags</h2>
            {tags.map((tag, index) => (
              <div key={index}>
                <input type="text" value={tag} onChange={(e) => handleTagChange(index, e.target.value)} />
                <button id="edit__article__btn__del" type="button" onClick={() => clearTag(index)}>
                  Delete
                </button>
              </div>
            ))}
          </div>
          <div id="edit__tags__create">
            <button type="button" onClick={addTag}>
              Add tag
            </button>
          </div>
        </div>
        <button id="edit__article__btn__send" type="submit">
          Send
        </button>
      </form>
    </div>
  );
};

export default EditArticle;
