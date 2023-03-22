const loggerMiddleware = (req, res, next) => {
  const { method, url } = req;
  const timestamp = new Date().toISOString();
  logger.info(`${method} ${url} ${timestamp}`);
  next();
};
  
module.exports = loggerMiddleware;