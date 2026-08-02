// Supplementary Problem 2:
// Route-specific middleware (NOT app.use) that only runs on routes where
// it's explicitly attached, e.g. router.put('/:id', validateTaskId, updateTask).
// It checks that :id is a valid positive integer BEFORE the controller runs.

function validateTaskId(req, res, next) {
  const { id } = req.params;

  // Must be a string of digits only (e.g. "12"), not "12abc" or "-1"
  if (!/^\d+$/.test(id)) {
    return res.status(400).json({
      error: 'Bad Request',
      message: `Invalid task id '${id}'. Task id must be a positive integer.`,
    });
  }

  // Attach the parsed integer so controllers don't need to re-parse it
  req.taskId = parseInt(id, 10);
  next();
}

module.exports = validateTaskId;
