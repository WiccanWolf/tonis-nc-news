exports.errorHandle = (err, req, res, next) => {
  const status = err.status || 500;
  const msg = err.msg || 'Internal Server Error';
  res.status(status).send({ msg });
};
