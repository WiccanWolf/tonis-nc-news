const { getTopics } = require('../app.controllers');
const topicsRouter = require('express').Router();

topicsRouter.route('/').get(getTopics);

module.exports = topicsRouter;
