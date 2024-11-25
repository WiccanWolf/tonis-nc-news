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
