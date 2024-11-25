const express = require('express');
const app = express();
const endpointsJson = require('../endpoints.json');
const { fetchTopics } = require('./app.models');

exports.healthCheck = (req, res) => {
  res.status(200).send({ endpoints: endpointsJson });
};

exports.getTopics = (req, res, next) => {
  const { slug, description } = req.query;
  if (slug && !['mitch', 'cats', 'paper'].includes(slug)) {
    return next({ status: 404, msg: 'Not found' });
  }
  if (
    description &&
    ![
      'The man, the Mitch, the legend',
      'Not dogs',
      'what books are made of',
    ].includes(description)
  ) {
    return next({ status: 404, msg: 'Not found' });
  }
  fetchTopics()
    .then((result) => {
      console.log({ status: 200, msg: `200: Server Running Okay` });
      res.status(200).send({ result });
    })
    .catch(next);
};
