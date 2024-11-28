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
exports.fetchArticles = (sort_by, order, topic) => {
  const validSortColumns = ['author', 'title', 'created_at', 'votes'];
  const validOrder = ['ASC', 'DESC'];
  const validTopics = ['mitch', 'cats', 'paper'];

  let query = `
  SELECT articles.*, COUNT(comments.comment_id) AS comment_count
  FROM articles
  LEFT JOIN comments ON comments.article_id = articles.article_id
  `;

  if (topic) {
    if (!validTopics.includes(topic)) {
      return Promise.reject({
        status: 400,
        msg: 'Bad Request: Invalid Topic Query',
      });
    }
    query += `WHERE topic = '${topic}' `;
  }

  query += `GROUP BY articles.article_id `;

  if (sort_by) {
    if (!validSortColumns.includes(sort_by)) {
      return Promise.reject({
        status: 400,
        msg: 'Bad Request: Invalid Sort Query',
      });
    }
    query += `ORDER BY ${sort_by} `;
  }

  if (order) {
    if (!validOrder.includes(order.toUpperCase())) {
      return Promise.reject({
        status: 400,
        msg: 'Bad Request: Invalid Order Query',
      });
    }
    query += `${order.toUpperCase()} `;
  }

  return db.query(`${query};`).then(({ rows }) => {
    return rows;
  });
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
exports.postNewComment = (article_id, username, body) => {
  if (!username) {
    return Promise.reject({ status: 400, msg: 'Bad Request' });
  }
  if (!body || body.trim().length === 0) {
    return Promise.reject({ status: 400, msg: 'Bad Request' });
  }
  const userCheckQuery = 'SELECT * FROM users WHERE username = $1;';
  return db
    .query(userCheckQuery, [username])
    .then(({ rows: userRows }) => {
      if (userRows.length === 0) {
        const DEFAULT_NAME = 'Anonymous';
        const newUserQuery = `
          INSERT INTO users (username, name)
          VALUES ($1, $2)
          RETURNING *;
        `;
        return db.query(newUserQuery, [username, DEFAULT_NAME]);
      }
    })
    .then(() => {
      const insertCommentQuery = `
        INSERT INTO comments (article_id, author, body)
        VALUES ($1, $2, $3)
        RETURNING *;
      `;
      return db.query(insertCommentQuery, [article_id, username, body]);
    })
    .then(({ rows: commentRows }) => {
      return commentRows[0];
    });
};
exports.updateArticleVotes = (articleId, incVotes) => {
  if (typeof incVotes !== 'number') {
    return Promise.reject({ status: 400, msg: 'Bad Request' });
  }
  return db
    .query(
      'UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *',
      [incVotes, articleId]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};
exports.removeCommentAtID = (comment_id) => {
  const query = `DELETE FROM comments WHERE comment_id = $1 RETURNING *;`;
  if (!Number(comment_id)) {
    return Promise.reject({ status: 400, msg: 'Bad Request' });
  }
  return db.query(`${query}`, [comment_id]);
};
exports.fetchUsers = () => {
  const query = `SELECT * FROM users`;
  return db.query(`${query};`).then(({ rows }) => {
    return rows;
  });
};
exports.fetchSpecificUser = (username) => {
  if (!username) {
    return Promise.reject({ status: 400, msg: 'Bad Request' });
  }
  const userCheckQuery = 'SELECT * FROM users WHERE username = $1;';
  return db.query(userCheckQuery, [username]).then(({ rows: userRows }) => {
    if (userRows.length === 0) {
      return Promise.reject({ status: 404, msg: 'Not Found' });
    }
    return userRows[0];
  });
};
