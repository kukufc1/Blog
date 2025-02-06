import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import ArticleForm from '../ArticleForm/ArticleForm';
import { useAuth } from '../AuthContext/AuthContext';
import { fetchEditArticle } from '../Api/Api';
import styles from '../css/styles.module.css';

const EditArticle = () => {
  const { slug } = useParams();
  const { state } = useAuth();
  const token = state.user?.token;
  const [initialData, setInitialData] = useState({ title: '', description: '', body: '', tagList: [''] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadArticle = async () => {
    try {
      const articleData = await fetchEditArticle(slug, token);
      setInitialData({ ...articleData, tagList: articleData.tagList.length > 0 ? articleData.tagList : [''] });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadArticle();
  }, [slug]);

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {error}</div>;
  if (!initialData) return <div>Статья не найдена.</div>;

  return (
    <div className={styles.wf80}>
      <h1>Edit article</h1>
      <ArticleForm initialData={initialData} isEditMode={true} />
    </div>
  );
};

export default EditArticle;
