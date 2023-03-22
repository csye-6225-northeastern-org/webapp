const morgan = require('morgan');
const logger = require('../utils/logger');

// const loggerMiddleware = morgan('combined', { stream: logger.stream });

const loggerMiddleware = (req, res, next) => {
  const { method, url, httpVersion } = req;
  const remoteAddress = req.connection.remoteAddress;

  res.on('finish', () => {
    const statusCode = res.statusCode;
    const contentLength = res.get('Content-Length') || '-';
    logger.info('Request processed', { method, url, httpVersion, remoteAddress, statusCode, contentLength });
  });

  next();
};
  
module.exports = loggerMiddleware;