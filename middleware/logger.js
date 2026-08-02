// Step 3: Request logging middleware.
// Applied globally with app.use() so it runs on EVERY incoming request,
// regardless of method or path, before the request reaches any route.

function requestLogger(req, res, next) {
  const timestamp = new Date().toISOString();
  console.log(`${req.method} ${req.url} - ${timestamp}`);
  next(); // hand control to the next middleware/route in the pipeline
}

module.exports = requestLogger;
