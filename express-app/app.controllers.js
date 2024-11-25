const endpointsJson = require('../endpoints.json');
const { fetchTopics, fetchArticleID, fetchArticles } = require('./app.models');

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

exports.getArticles = (req, res, next) => {
  const { sort_by = 'created_at', order = 'DESC' } = req.query;

  const validSortColumns = [
    'author',
    'title',
    'author_id',
    'topic',
    'created_at',
    'votes',
    'article_img_url',
  ];

  const validOrder = ['ASC', 'DESC'];

  if (sort_by && !validSortColumns.includes(sort_by.toLowerCase())) {
    return next({ status: 400, msg: 'Bad Request: Invalid Sort Query' });
  }
  if (order && !validOrder.includes(order.toUpperCase())) {
    return next({ status: 400, msg: 'Bad request: Invalid Order Query' });
  }

  fetchArticles(sort_by, order)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};
