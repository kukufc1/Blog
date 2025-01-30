import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../ArticleList/ArticleList.css';

const ArticleList = () => {
  const [allArticles, setAllArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [articlesCount, setArticlesCount] = useState(0);
  const articlesPerPage = 5;

  const fetchArticles = async (page) => {
    const offset = (page - 1) * articlesPerPage;
    const response = await fetch(
      `https://blog-platform.kata.academy/api/articles?limit=${articlesPerPage}&offset=${offset}`
    );
    if (!response.ok) {
      throw new Error('Не удалось получить статьи');
    }
    const data = await response.json();
    setArticlesCount(data.articlesCount);
    return data.articles;
  };

  useEffect(() => {
    const loadArticles = async () => {
      setLoading(true);
      try {
        const articles = await fetchArticles(currentPage);
        setAllArticles(articles);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadArticles();
  }, [currentPage]);

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {error}</div>;

  const totalPages = Math.ceil(articlesCount / articlesPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const getPaginationRange = () => {
    const range = [];
    const startPage = Math.max(currentPage - 2, 1);
    const endPage = Math.min(currentPage + 2, totalPages);

    for (let i = startPage; i <= endPage; i++) {
      range.push(i);
    }

    return range;
  };

  return (
    <div className="list">
      <div>
        <ul className="flex_box">
          {allArticles.map((article) => (
            <li className="list__box" key={article.slug}>
              <div className="list__content">
                <div className="content__likes">
                  <Link to={`/articles/${article.slug}`}>{article.title}</Link>
                  <p>💜 {article.favoritesCount}</p>
                </div>
                {article.tagList && article.tagList.length > 0 && (
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
                )}
                <p id="list__descrip">{article.description}</p>
              </div>
              <div className="list__author">
                <div className="author__info">
                  <span>{article.author ? article.author.username : 'Неизвестен'}</span>
                  <p>
                    {new Date(article.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <div className="author__img">
                  <img src={article.author.image} alt={article.title} />
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="pagination">
        <button id="prev" onClick={handlePrevPage} disabled={currentPage === 1}>
          &#8249;
        </button>
        {getPaginationRange().map((page) => (
          <button key={page} onClick={() => setCurrentPage(page)} className={currentPage === page ? 'active' : ''}>
            {page}
          </button>
        ))}
        <button id="next" onClick={handleNextPage} disabled={currentPage === totalPages}>
          &#8250;
        </button>
      </div>
    </div>
  );
};

export default ArticleList;
