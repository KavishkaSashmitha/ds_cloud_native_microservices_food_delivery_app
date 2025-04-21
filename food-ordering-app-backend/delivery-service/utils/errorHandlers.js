/**
 * Error handling utilities
 */

// Send standard error response
const sendErrorResponse = (res, status, message, error) => {
  console.error(`Error: ${message}`, error);
  
  res.status(status).json({
    success: false,
    message,
    error: process.env.NODE_ENV === 'development' ? error?.message : undefined
  });
};

// Send standard success response
const sendSuccessResponse = (res, status, data) => {
  res.status(status).json({
    success: true,
    data
  });
};

module.exports = {
  sendErrorResponse,
  sendSuccessResponse
};