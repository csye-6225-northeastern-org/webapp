const StatsD = require('hot-shots');
const logger = require("../utils/logger");

const statsd = new StatsD({ host: 'localhost', port: 8125 });

async function statsMiddleware(req, res, next){
    const method = req.method;
    const path = req.originalUrl.replace(/\/:[a-zA-Z]+/g, '').replace(/\/\d+/g, '');
    const route = path.replace(/\//g, '.').replace(/(\?.*)/g, '');
    const metricName = `api.${method}${route}.calls`;
    statsd.increment(metricName);
    next();
};

module.exports = statsMiddleware;
