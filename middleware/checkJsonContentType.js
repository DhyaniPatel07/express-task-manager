// Supplementary Problem 1:
// Reject POST/PUT requests that don't declare Content-Type: application/json.
// This protects the controller from ever receiving a malformed/undefined body.

function checkJsonContentType(req, res, next) {
  const methodsToCheck = ['POST', 'PUT'];

  if (methodsToCheck.includes(req.method)) {
    const contentType = req.headers['content-type'];

    if (!contentType || !contentType.includes('application/json')) {
      return res.status(415).json({
        error: 'Unsupported Media Type',
        message: 'Content-Type must be application/json',
      });
    }
  }

  next();
}

module.exports = checkJsonContentType;
