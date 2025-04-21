/**
 * Logger utility for delivery service
 */

// Simple logger that wraps console.log with some formatting
const logger = {
  info: (message, meta = {}) => {
    console.log(`[INFO] ${message}`, meta);
  },
  
  error: (message, meta = {}) => {
    console.error(`[ERROR] ${message}`, meta);
  },
  
  warn: (message, meta = {}) => {
    console.warn(`[WARN] ${message}`, meta);
  },
  
  debug: (message, meta = {}) => {
    if (process.env.DEBUG) {
      console.debug(`[DEBUG] ${message}`, meta);
    }
  }
};

module.exports = { logger };