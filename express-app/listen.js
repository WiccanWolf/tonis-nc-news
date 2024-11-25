const app = require('express')();
const port = 8000;
app.listen(port, () => {
  console.log(`Server listening on port | http://localhost:${port}`);
});
