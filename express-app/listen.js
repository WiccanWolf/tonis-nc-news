const app = require('./app');
const port = 8000;
const server = app.listen(port, () => {
  console.log(`Server listening on port | http://localhost:${port}`);
});
module.exports = server;
