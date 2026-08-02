const express = require('express');
const router = express.Router();

const validateTaskId = require('../middleware/validateTaskId');
const {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} = require('../controllers/taskController');

// GET /tasks
router.get('/', getAllTasks);

// GET /tasks/:id  (route-specific middleware validates :id first)
router.get('/:id', validateTaskId, getTaskById);

// POST /tasks
router.post('/', createTask);

// PUT /tasks/:id  (route-specific middleware validates :id first)
router.put('/:id', validateTaskId, updateTask);

// DELETE /tasks/:id  (route-specific middleware validates :id first)
router.delete('/:id', validateTaskId, deleteTask);

module.exports = router;
