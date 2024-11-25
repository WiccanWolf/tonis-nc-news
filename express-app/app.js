const express = require('express');
const app = express();
app.use(express.json());
const { healthCheck, getTopics } = require('./app.controllers');

app.get('/api', healthCheck);

app.get('/api/topics', getTopics);

app.use((req, res) => {
  res.status(404).send({ msg: `Not found` });
});

app.use((err, req, res, next) => {
  const status = err.status || 500;
  const msg = err.msg || 'Internal Server Error';
  res.status(status).send({ msg });
});

module.exports = app;
