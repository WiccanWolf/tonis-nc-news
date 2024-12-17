const { getTopics, getSpecificTopic } = require('../app.controllers');
const topicsRouter = require('express').Router();

topicsRouter.route('/').get(getTopics);
topicsRouter.route('/:slug').get(getSpecificTopic);

module.exports = topicsRouter;
