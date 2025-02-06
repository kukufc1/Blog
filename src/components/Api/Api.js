const API_BASE_URL = 'https://blog-platform.kata.academy/api';

export const fetchArticle = async (slug, token) => {
  const response = await fetch(`${API_BASE_URL}/articles/${slug}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error('Не удалось получить статью');
  }
  return response.json();
};

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
export const deleteArticle = async (slug, token) => {
  const response = await fetch(`${API_BASE_URL}/articles/${slug}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error('Failed to delete the article');
  }
};

// !!!!!!!!!!!!!!!!!!
export const toggleFavorite = async (slug, isFavorited, token) => {
  const response = await fetch(`${API_BASE_URL}/articles/${slug}/favorite`, {
    method: isFavorited ? 'DELETE' : 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Сетевая ошибка при изменении статуса лайка');
  }

  return await response.json();
};
// !!!!!!!!!!!!!!!!!!!!
export const createArticle = async (articlePayload, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/articles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(articlePayload),
    });

    const data = await response.json();
    return { response, data };
  } catch (error) {
    console.error('Ошибка во время создания статьи:', error);
    throw new Error('Ошибка сети');
  }
};
// !!!!!!!!!!!!!!!!!!!!
export const fetchEditArticle = async (slug, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/articles/${slug}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      },
    });
    if (!response.ok) throw new Error('Ошибка при загрузке статьи');
    const data = await response.json();
    return data.article;
  } catch (err) {
    throw new Error(err.message);
  }
};
// !!!!!!!!!!!!!!!!!!!!
export const updatedEditArticle = async (slug, articlePayload, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/articles/${slug}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(articlePayload),
    });
    if (!response.ok) throw new Error('Ошибка при обновлении статьи');
    return await response.json();
  } catch (err) {
    throw new Error(err.message);
  }
};
// !!!!!!!!!!!!!!!!!!!!
export const updateUserProfile = async (userData, token) => {
  const response = await fetch(`${API_BASE_URL}/user`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify({ user: userData }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Ошибка обновления профиля');
  }

  return await response.json();
};
// !!!!!!!!!!!!!!!!!!!!

export const loginUser = async (formData, token) => {
  const response = await fetch(`${API_BASE_URL}/users/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify({ user: formData }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Ошибка при входе');
  }

  return data;
};
// !!!!!!!!!!!!!!!!!!!!
export const registerUser = async (formData, token) => {
  const response = await fetch(`${API_BASE_URL}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify({ user: formData }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Ошибка при регистрации');
  }

  return data;
};
// !!!!!!!!!!!!!!!!!!!!

// !!!!!!!!!!!!!!!!!!!!
