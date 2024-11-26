const express = require('express');
const app = express();
const {
  healthCheck,
  getTopics,
  getArticleID,
  getArticles,
  getComments,
} = require('./app.controllers');
const { routeHandle } = require('./error-handling/routeHandle');
const { errorHandle } = require('./error-handling/errorHandle');

app.use(express.json());

app.get('/api', healthCheck);

app.get('/api/topics', getTopics);

app.get('/api/articles/:article_id', getArticleID);

app.get('/api/articles', getArticles);

app.get('/api/articles/:article_id/comments', getComments);

app.all('*', routeHandle);
app.use(errorHandle);

module.exports = app;
