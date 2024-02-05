/**
 * Centralized financial error handler with Mongoose validation formatting
 */
const errorHandler = (err, req, res, next) => {
  console.error('[Server Exception]', err);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(val => val.message);
    return res.status(400).json({
      success: false,
      error: 'ValidationError',
      messages
    });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(409).json({
      success: false,
      error: 'DuplicateResourceConflict',
      message: `A record with this ${field} already exists.`
    });
  }

  // CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      error: 'InvalidIdentifier',
      message: `Resource format invalid for ID: ${err.value}`
    });
  }

  // General internal server error
  res.status(err.status || 500).json({
    success: false,
    error: err.name || 'InternalServerError',
    message: err.message || 'An unexpected payment gateway exception occurred.'
  });
};

module.exports = errorHandler;
