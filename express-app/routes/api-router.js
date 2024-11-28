const { healthCheck } = require('../app.controllers');
const articlesRouter = require('./articles-router');
const commentsRouter = require('./comments-router');
const topicsRouter = require('./topics-router');
const usersRouter = require('./users-router');
const apiRouter = require('express').Router();

apiRouter.use('/users', usersRouter);
apiRouter.use('/articles', articlesRouter);
apiRouter.use('/comments', commentsRouter);
apiRouter.use('/topics', topicsRouter);

apiRouter.get('/', healthCheck);

module.exports = apiRouter;
