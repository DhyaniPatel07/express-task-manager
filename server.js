const express = require('express');

const requestLogger = require('./middleware/logger');
const checkJsonContentType = require('./middleware/checkJsonContentType');
const notFoundHandler = require('./middleware/notFoundHandler');
const errorHandler = require('./middleware/errorHandler');
const taskRoutes = require('./routes/tasks');

const app = express();
const PORT = process.env.PORT || 5000;

/**
 * MIDDLEWARE PIPELINE — order matters! Express runs these top to bottom.
 *
 * 1. express.json()        -> parses JSON request bodies into req.body
 * 2. requestLogger         -> logs every request (global, via app.use)
 * 3. checkJsonContentType  -> blocks POST/PUT without proper Content-Type
 * 4. taskRoutes            -> the actual REST endpoints (router-specific
 *                             middleware like validateTaskId lives inside here)
 * 5. notFoundHandler       -> catches any URL that didn't match a route above
 * 6. errorHandler          -> catches any error passed via next(err); MUST be last
 */

app.use(express.json());
app.use(requestLogger);
app.use(checkJsonContentType);

app.use('/tasks', taskRoutes);

// A simple health-check root route
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Task Manager API is running' });
});

app.use(notFoundHandler); // catches unmatched routes
app.use(errorHandler); // catches errors — must be registered last

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
