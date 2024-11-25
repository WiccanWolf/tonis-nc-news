const endpointsJson = require('../endpoints.json');
const { fetchTopics, fetchArticleID } = require('./app.models');

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
  if (!article_id || !Number(article_id)) {
    return next({ status: 400, msg: 'Bad Request' });
  }
  fetchArticleID(article_id)
    .then((article) => {
      if (!article) {
        return next({ status: 404, msg: 'Not found' });
      }
      res.status(200).send({ article });
    })
    .catch(next);
};
