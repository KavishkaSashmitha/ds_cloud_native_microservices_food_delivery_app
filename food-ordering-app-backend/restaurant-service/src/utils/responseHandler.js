/**
 * Send a success response
 * @param {Object} res - Express response object
 * @param {Number} statusCode - HTTP status code
 * @param {String} message - Success message
 * @param {Object} data - Response data
 * @returns {Object} Response object
 */
const successResponse = (res, statusCode = 200, message = 'Success', data = null) => {
    return res.status(statusCode).json({
      success: true,
      message,
      data
    });
  };
  
  /**
   * Send an error response
   * @param {Object} res - Express response object
   * @param {Number} statusCode - HTTP status code
   * @param {String} message - Error message
   * @param {Object} errors - Error details
   * @returns {Object} Response object
   */
  const errorResponse = (res, statusCode = 500, message = 'Error', errors = null) => {
    return res.status(statusCode).json({
      success: false,
      message,
      errors
    });
  };
  
  module.exports = {
    successResponse,
    errorResponse
  };