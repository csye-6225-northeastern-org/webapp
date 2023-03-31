const morgan = require('morgan');
const logger = require('../utils/logger');

const loggerMiddleware = morgan('combined', { stream: logger.stream });
  
module.exports = loggerMiddleware;
