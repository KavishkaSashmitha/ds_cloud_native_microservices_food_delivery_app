const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  defaultMeta: { service: 'restaurant-service' },
  transports: [
    new winston.transports.Console({
      format: winston.format.simple()
    }),
    new winston.transports.File({ 
      filename: 'logs/restaurant-service-error.log', 
      level: 'error' 
    }),
    new winston.transports.File({ 
      filename: 'logs/restaurant-service-combined.log' 
    })
  ]
});

module.exports = logger;