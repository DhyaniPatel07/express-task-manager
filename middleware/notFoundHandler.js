// Supplementary Problem 3:
// Catches any request that didn't match ANY route defined above it.
// Must be registered AFTER all real routes but BEFORE the error handler.

function notFoundHandler(req, res, next) {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.originalUrl} does not exist`,
  });
}

module.exports = notFoundHandler;
