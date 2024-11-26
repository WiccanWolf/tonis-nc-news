const endpointsJson = require('../endpoints.json');
const {
  fetchTopics,
  fetchArticleID,
  fetchArticles,
  fetchComments,
} = require('./app.models');

exports.healthCheck = (req, res) => {
  res.status(200).send({ endpoints: endpointsJson });
};

exports.getTopics = (req, res, next) => {
  fetchTopics()
    .then((topic) => {
      res.status(200).send({ topic });
    })
    .catch(next);
};

exports.getArticleID = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticleID(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.getArticles = (req, res, next) => {
  const { sort_by = 'created_at', order = 'DESC' } = req.query;
  fetchArticles(sort_by, order)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.getComments = (req, res, next) => {
  const { article_id } = req.params;
  fetchComments(article_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};
