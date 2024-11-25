const db = require('../db/connection');

exports.fetchTopics = (slug, description) => {
  let query = `SELECT * FROM topics`;
  if (slug) {
    query += ` WHERE slug = ${'slug'}`;
  }
  if (description) {
    query += ` WHERE description = ${`description`}`;
  }
  return db.query(`${query};`).then(({ rows }) => {
    return rows;
  });
};
