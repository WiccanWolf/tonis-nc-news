const { deleteComment } = require('../app.controllers');
const commentsRouter = require('express').Router();

commentsRouter.route('/:comment_id').delete(deleteComment);

module.exports = commentsRouter;
