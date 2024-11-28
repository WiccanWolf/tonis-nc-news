const { getUsers } = require('../app.controllers');
const usersRouter = require('express').Router();

usersRouter.route('/').get(getUsers);

module.exports = usersRouter;
