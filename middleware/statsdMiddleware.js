const StatsD = require('hot-shots');

const statsd = new StatsD({ host: 'localhost', port: 8125 });

async function statsMiddleware(req, res, next){
    const method = req.method;
    const route = req.originalUrl.replace(/\//g, '.').replace(/(\?.*)/g, '');
    const metricName = `api.${method}${route}.calls`;
    statsd.increment(metricName);
    next();
};

module.exports = statsMiddleware;
