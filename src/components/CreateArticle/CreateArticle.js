import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import '../CreateArticle/CreateArticle.css';
import { createArticle } from '../Api/Api';

const CreateArticle = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    body: '',
    tagList: [],
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const articlePayload = {
      article: {
        title: formData.title,
        description: formData.description,
        body: formData.body,
        tagList: formData.tagList,
      },
    };
    console.log('Отправка данных на сервер:', articlePayload);
    try {
      const token = localStorage.getItem('token');
      const { response, data } = await createArticle(articlePayload, token);
      if (!response.ok) {
        setErrors({ server: data.message || 'Ошибка при создании статьи' });
      } else {
        console.log('Статья успешно создана:', data);
        setFormData({ title: '', description: '', body: '', tagList: [] });
        navigate('/articles');
      }
    } catch (error) {
      console.error('Ошибка во время создания статьи:', error);
      setErrors({ server: 'Ошибка сети' });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleTagChange = (index, value) => {
    const updatedTags = [...formData.tagList];
    updatedTags[index] = value;
    setFormData({ ...formData, tagList: updatedTags });
  };

  const addTag = () => {
    if (formData.tagList.length < 3) {
      setFormData({ ...formData, tagList: [...formData.tagList, ''] });
    }
  };

  const clearTag = (index) => {
    const updatedTags = formData.tagList.filter((_, i) => i !== index);
    setFormData({ ...formData, tagList: updatedTags });
  };

  return (
    <div className="createArticle">
      <form onSubmit={handleSubmit}>
        <div className="createArticle__title">
          <h1>Create new article</h1>
          <label>Title</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} />
          {errors.title && <span>{errors.title}</span>}
        </div>

        <div className="createArticle__description">
          <label>Short description</label>
          <input type="text" name="description" value={formData.description} onChange={handleChange} />
          {errors.description && <span>{errors.description}</span>}
        </div>

        <div className="createArticle__text">
          <label>Text</label>
          <textarea name="body" value={formData.body} onChange={handleChange} />
          {errors.body && <span>{errors.body}</span>}
        </div>

        <div className="createArticle__tags">
          <div id="createArticle__form">
            <h2>Tags</h2>
            {formData.tagList.map((tag, index) => (
              <div key={index}>
                <input type="text" value={tag} onChange={(e) => handleTagChange(index, e.target.value)} />
                <button id="createArticle__btn__del" type="button" onClick={() => clearTag(index)}>
                  Delete
                </button>
              </div>
            ))}
          </div>
          <div id="createArticle__create">
            <button type="button" onClick={addTag}>
              Add tag
            </button>
          </div>

          {errors.tags && <span>{errors.tags}</span>}
        </div>

        <button id="createArticle__send" type="submit">
          Send
        </button>
        {errors.server && <span>{errors.server}</span>}
      </form>
    </div>
  );
};

export default CreateArticle;
