const { getUsers, getSpecificUser, userLogin } = require('../app.controllers');
const usersRouter = require('express').Router();

usersRouter.route('/').get(getUsers);
usersRouter.route('/:username').get(getSpecificUser);
usersRouter.route('/login').post(userLogin);

module.exports = usersRouter;
