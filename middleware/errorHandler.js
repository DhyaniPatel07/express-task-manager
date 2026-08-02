// Step 5: Global error handling middleware.
// Express recognizes this as an ERROR handler (not regular middleware)
// specifically because it takes 4 parameters: (err, req, res, next).
// It must be the LAST app.use() call so it can catch errors thrown or
// passed via next(err) from anywhere earlier in the pipeline.

function errorHandler(err, req, res, next) {
  // Log the full stack trace on the server for debugging —
  // this never gets sent to the client.
  console.error(err.stack);

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    error: statusCode === 500 ? 'Internal Server Error' : err.name || 'Error',
    message: err.message || 'Something went wrong',
    // Deliberately NOT sending err.stack to the client — see README
    // for why raw stack traces should never be exposed.
  });
}

module.exports = errorHandler;
