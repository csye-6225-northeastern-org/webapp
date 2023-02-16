function loggerMiddleware(req, res, next) {
    console.log("Calling API : ", `${req.method} ${req.url}`);
    const start = Date.now();
  
    res.on('finish', () => {
      const elapsed = Date.now() - start;
      console.log(`${req.method} ${req.url} ${res.statusCode} ${elapsed}ms`);
    });
  
    next();
}
  
module.exports = loggerMiddleware;