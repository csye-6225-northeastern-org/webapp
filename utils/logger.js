var appRoot = require('app-root-path');
const winston = require('winston');

var config = {
  file: {
    level: 'info',
    filename: `${appRoot}/logs/combined.log`,
    handleExceptions: true,
    json: true,
    maxFiles: 5,
    colorize: false,
  },
  console: {
    level: 'debug',
    handleExceptions: true,
    json: false,
    colorize: true,
  },
};

const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level}: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(config.console),
    new winston.transports.File(config.file),
  ],
  exitOnError: false
});

logger.stream = {
  write: function(message, encoding) {
    // use the 'info' log level so the output will be picked up by both transports (file and console)
    logger.info(message);
  },
};

module.exports = logger;
