// In-memory "database" — just an array living in server memory.
// Data resets every time the server restarts (no persistence yet).

let tasks = [
  { id: 1, title: 'Learn Express basics', completed: false },
  { id: 2, title: 'Build CRUD routes', completed: false },
];

let nextId = 3; // simple auto-increment counter for new task IDs

module.exports = { tasks, getNextId: () => nextId++ };
