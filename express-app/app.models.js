const db = require('../db/connection');

exports.fetchTopics = () => {
  return db.query(`SELECT * FROM topics;`).then(({ rows }) => {
    return rows;
  });
};

exports.fetchArticleID = (article_id) => {
  if (isNaN(Number(article_id))) {
    return Promise.reject({ status: 400, msg: 'Bad Request' });
  }

  const query = `SELECT * FROM articles WHERE article_id = $1;`;
  return db.query(query, [article_id]).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ status: 404, msg: 'Not Found' });
    }
    return rows[0];
  });
};

exports.fetchArticles = (sort_by = 'created_at', order = 'DESC') => {
  const validSortColumns = ['author', 'title', 'created_at', 'votes'];
  const validOrder = ['ASC', 'DESC'];

  if (!validSortColumns.includes(sort_by)) {
    return Promise.reject({
      status: 400,
      msg: 'Bad Request: Invalid Sort Query',
    });
  }

  if (!validOrder.includes(order.toUpperCase())) {
    return Promise.reject({
      status: 400,
      msg: 'Bad Request: Invalid Order Query',
    });
  }

  const query = `
    SELECT articles.*, COUNT(comments.comment_id) AS comment_count
    FROM articles
    LEFT JOIN comments ON comments.article_id = articles.article_id
    GROUP BY articles.article_id
    ORDER BY ${sort_by} ${order};
  `;

  return db.query(query).then(({ rows }) => rows);
};

exports.fetchComments = (article_id) => {
  const query = `SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC`;
  if (!article_id) {
    return Promise.reject({ status: 404, msg: 'Not Found' });
  }
  if (article_id && isNaN(Number(article_id))) {
    return Promise.reject({ status: 400, msg: 'Bad Request' });
  }
  return db.query(`${query};`, [article_id]).then(({ rows }) => {
    return rows;
  });
};
