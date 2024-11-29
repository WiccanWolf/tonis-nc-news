const { deleteComment, updateComment } = require('../app.controllers');
const commentsRouter = require('express').Router();

commentsRouter.route('/:comment_id').delete(deleteComment).patch(updateComment);

module.exports = commentsRouter;
