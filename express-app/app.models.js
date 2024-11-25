const db = require('../db/connection');

exports.fetchTopics = () => {
  return db.query(`SELECT * FROM topics;`).then(({ rows }) => {
    return rows;
  });
};

exports.fetchArticleID = (articleID) => {
  let query = `SELECT * FROM articles`;
  if (articleID) {
    query += ` WHERE article_id = ${articleID}`;
  }
  return db.query(`${query};`).then(({ rows }) => {
    return rows[0];
  });
};

exports.fetchArticles = (sort_by, order) => {
  let query = `SELECT articles.*, COUNT(comments.comment_id) AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id GROUP BY articles.article_id`;

  if (sort_by) {
    query += ` ORDER BY ${sort_by}`;
    query += ` ${order.toUpperCase()}`;
  }

  return db.query(`${query};`).then(({ rows }) => {
    return rows.map((article) => {
      const { body, ...removedBody } = article;
      return removedBody;
    });
  });
};
