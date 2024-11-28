const {
  getArticles,
  getArticleID,
  updateArticle,
  getComments,
  createComment,
  getAllArticles,
} = require('../app.controllers');

const articlesRouter = require('express').Router();

articlesRouter.route('/').get(getArticles).get(getAllArticles);

articlesRouter.route('/:article_id').get(getArticleID).patch(updateArticle);

articlesRouter
  .route('/:article_id/comments')
  .get(getComments)
  .post(createComment);

module.exports = articlesRouter;
