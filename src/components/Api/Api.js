const API_BASE_URL = 'https://blog-platform.kata.academy/api';

export const fetchArticle = async (slug) => {
  const response = await fetch(`${API_BASE_URL}/articles/${slug}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${localStorage.getItem('token')}`,
    },
  });
  if (!response.ok) {
    throw new Error('Не удалось получить статью');
  }
  return response.json();
};

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
export const deleteArticle = async (slug) => {
  const response = await fetch(`${API_BASE_URL}/articles/${slug}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${localStorage.getItem('token')}`,
    },
  });
  if (!response.ok) {
    throw new Error('Failed to delete the article');
  }
};

// !!!!!!!!!!!!!!!!!!
export const toggleFavorite = async (slug, isFavorited) => {
  const response = await fetch(`${API_BASE_URL}/articles/${slug}/favorite`, {
    method: isFavorited ? 'DELETE' : 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${localStorage.getItem('token')}`,
    },
  });

  if (!response.ok) {
    throw new Error('Сетевая ошибка при изменении статуса лайка');
  }

  return await response.json();
};
// !!!!!!!!!!!!!!!!!!!!
