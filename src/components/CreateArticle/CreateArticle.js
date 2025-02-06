import React from 'react';

import ArticleForm from '../ArticleForm/ArticleForm';
import '../CreateArticle/CreateArticle.css';
import styles from '../css/styles.module.css';

const CreateArticle = () => {
  const initialData = {
    title: '',
    description: '',
    body: '',
    tagList: [],
  };

  return (
    <div className={styles.wf80}>
      <h1>Create new article</h1>
      <ArticleForm initialData={initialData} isEditMode={false} />
    </div>
  );
};

export default CreateArticle;
