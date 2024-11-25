const express = require('express');
const app = express();
const endpointsJson = require('./endpoints.json');
app.use(express.json());

app.get('/api', (req, res) => {
  res.status(200).send({ endpoints: endpointsJson });
});

app.use((err, req, res, next) => {
  const status = err.status || 500;
  const msg = err.msg || 'Internal Server Error';
  res.status(status).send({ msg });
});

module.exports = app;
