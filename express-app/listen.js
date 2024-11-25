const express = require('express');
const app = express();
const port = 8000;
const server = app.listen(port, () => {
  console.log(`Server listening on port | http://localhost:${port}`);
});
module.exports = server;
