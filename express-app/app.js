const express = require('express');
const app = express();
const cors = require('cors');

const { routeHandle } = require('./error-handling/routeHandle');
const { errorHandle } = require('./error-handling/errorHandle');
const apiRouter = require('./routes/api-router');

app.use(cors());

app.use(express.json());

app.use('/api', apiRouter);

app.all('*', routeHandle);

app.use(errorHandle);

module.exports = app;
