const { getUsers, getSpecificUser } = require('../app.controllers');
const usersRouter = require('express').Router();

usersRouter.route('/').get(getUsers);
usersRouter.route('/:username').get(getSpecificUser);

module.exports = usersRouter;
