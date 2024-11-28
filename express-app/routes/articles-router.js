const {
  getArticles,
  getArticleID,
  updateArticle,
  getComments,
  createComment,
} = require('../app.controllers');

const articlesRouter = require('express').Router();

articlesRouter.route('/').get(getArticles);

articlesRouter.route('/:article_id').get(getArticleID).patch(updateArticle);

articlesRouter
  .route('/:article_id/comments')
  .get(getComments)
  .post(createComment);

module.exports = articlesRouter;
