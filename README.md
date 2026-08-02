# Task Manager API — Practical 4

A RESTful backend built with Node.js + Express, featuring a full
middleware pipeline: logging → content-type check → routing → 404 handler →
global error handler.

## Project structure

```
task-manager-api/
├── server.js                      # entry point, wires the whole pipeline
├── data/
│   └── taskStore.js               # in-memory "database" (array)
├── middleware/
│   ├── logger.js                  # logs method, URL, timestamp (Step 3)
│   ├── checkJsonContentType.js    # Supplementary Problem 1
│   ├── validateTaskId.js          # Supplementary Problem 2
│   ├── notFoundHandler.js         # Supplementary Problem 3
│   └── errorHandler.js            # global error handler (Step 5)
├── controllers/
│   └── taskController.js          # CRUD logic (Step 4)
└── routes/
    └── tasks.js                   # Express Router wiring routes → controllers
```

## Setup

```bash
cd task-manager-api
npm install
node server.js
```

Server starts on **http://localhost:5000**.

## Endpoints

| Method | Path         | Description            | Success | Errors             |
|--------|--------------|-------------------------|---------|---------------------|
| GET    | /tasks       | List all tasks          | 200     | —                   |
| GET    | /tasks/:id   | Get one task             | 200     | 400 (bad id), 404   |
| POST   | /tasks       | Create a task            | 201     | 400, 415            |
| PUT    | /tasks/:id   | Update a task            | 200     | 400, 404, 415       |
| DELETE | /tasks/:id   | Delete a task            | 200     | 400 (bad id), 404   |

POST/PUT body example:
```json
{ "title": "Buy groceries", "completed": false }
```

## Testing with curl (or import into Postman)

```bash
# List tasks
curl http://localhost:5000/tasks

# Create a task
curl -X POST http://localhost:5000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Write tests"}'

# Update a task
curl -X PUT http://localhost:5000/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"completed":true}'

# Delete a task
curl -X DELETE http://localhost:5000/tasks/2

# Trigger the Content-Type middleware (415)
curl -X POST http://localhost:5000/tasks -d '{"title":"no header"}'

# Trigger id validation (400)
curl -X PUT http://localhost:5000/tasks/abc -d '{}' -H "Content-Type: application/json"

# Trigger 404 handler
curl http://localhost:5000/unknown-route
```

All of the above were run and verified while building this project — see
the terminal output that was shown alongside this file for the actual
responses.

## Key Questions — Answers

**Why must the error-handling middleware be defined last?**
Express matches middleware and routes in the order they're registered,
top to bottom, for every request. An error handler is recognized by
its **4-argument signature** `(err, req, res, next)`. When any middleware
or route calls `next(err)` (or throws synchronously), Express skips all
remaining *regular* middleware and jumps straight to the next
error-handling middleware in the chain. If the error handler were placed
first, it wouldn't be "next" relative to anything — errors thrown later
in the pipeline would have nothing after them to catch them, and would
either crash the process or return an unhandled response. Placing it
last guarantees it's the final safety net that can catch errors from
every route and middleware that came before it.

**`app.use()` vs. route-specific middleware?**
- `app.use(fn)` attaches middleware **globally** — it runs on every
  request that reaches the app (or, if given a path prefix like
  `app.use('/tasks', fn)`, on every request under that prefix),
  regardless of HTTP method. Our `requestLogger` and
  `checkJsonContentType` are examples: every request passes through them.
- Route-specific middleware is attached to a **single route** by listing
  it as an extra argument before the controller, e.g.
  `router.put('/:id', validateTaskId, updateTask)`. It only runs for that
  exact method + path combination. Our `validateTaskId` only runs on
  `GET/PUT/DELETE /tasks/:id`, not on `GET /tasks` or `POST /tasks`,
  because those routes don't need an `:id` at all.

**Why is it bad practice to send raw error stack traces to the client?**
- **Security**: a stack trace reveals internal file paths, folder
  structure, package versions, and sometimes fragments of source code or
  query strings — a roadmap for anyone probing for vulnerabilities.
- **Leaking implementation details**: it exposes exactly which framework,
  ORM, or library versions you're running, making it easier to look up
  known exploits for those versions.
- **Poor UX / unprofessional**: clients (especially non-technical ones)
  don't need or want a wall of internal function calls — they need a
  clear, structured message they can act on.
- **Correct approach** (what `errorHandler.js` does here): log the full
  `err.stack` to the server console/log files for developers, but return
  only a clean, minimal JSON object (`error`, `message`) to the client.

## Supplementary problems implemented

1. **`checkJsonContentType.js`** — rejects POST/PUT requests missing
   `Content-Type: application/json` with a `415 Unsupported Media Type`.
2. **`validateTaskId.js`** — route-specific middleware validating that
   `:id` is a positive integer before the controller ever runs; returns
   `400 Bad Request` otherwise.
3. **`notFoundHandler.js`** — catches any request that didn't match a
   defined route and returns a structured `404` JSON response.
