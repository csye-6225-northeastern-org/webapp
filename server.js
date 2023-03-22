const app = require("./app");
const logger = require('./utils/logger');
// PORT=4000 node server.js
// lets us run on a different port from the dev server from `npm start`
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => logger.info(`http://localhost:${PORT}`));
