const { tasks, getNextId } = require('../data/taskStore');

// GET /tasks — return all tasks
function getAllTasks(req, res) {
  res.status(200).json({ count: tasks.length, tasks });
}

// GET /tasks/:id — return a single task
function getTaskById(req, res) {
  const id = req.taskId; // set by validateTaskId middleware
  const task = tasks.find((t) => t.id === id);

  if (!task) {
    return res.status(404).json({ error: 'Not Found', message: `Task ${id} not found` });
  }

  res.status(200).json(task);
}

// POST /tasks — create a new task
function createTask(req, res, next) {
  try {
    const { title, completed } = req.body || {};

    if (!title || typeof title !== 'string' || !title.trim()) {
      // Delegate to the global error handler with a 400 status
      const err = new Error('Task "title" is required and must be a non-empty string');
      err.statusCode = 400;
      err.name = 'ValidationError';
      return next(err);
    }

    const newTask = {
      id: getNextId(),
      title: title.trim(),
      completed: Boolean(completed) || false,
    };

    tasks.push(newTask);
    res.status(201).json(newTask); // 201 = resource created
  } catch (err) {
    next(err); // unexpected errors fall through to the global handler
  }
}

// PUT /tasks/:id — update an existing task
function updateTask(req, res, next) {
  try {
    const id = req.taskId;
    const task = tasks.find((t) => t.id === id);

    if (!task) {
      return res.status(404).json({ error: 'Not Found', message: `Task ${id} not found` });
    }

    const { title, completed } = req.body || {};

    if (title !== undefined) {
      if (typeof title !== 'string' || !title.trim()) {
        const err = new Error('"title" must be a non-empty string');
        err.statusCode = 400;
        err.name = 'ValidationError';
        return next(err);
      }
      task.title = title.trim();
    }

    if (completed !== undefined) {
      task.completed = Boolean(completed);
    }

    res.status(200).json(task);
  } catch (err) {
    next(err);
  }
}

// DELETE /tasks/:id — remove a task
function deleteTask(req, res) {
  const id = req.taskId;
  const index = tasks.findIndex((t) => t.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Not Found', message: `Task ${id} not found` });
  }

  const [removed] = tasks.splice(index, 1);
  res.status(200).json({ message: 'Task deleted', task: removed });
}

module.exports = { getAllTasks, getTaskById, createTask, updateTask, deleteTask };
