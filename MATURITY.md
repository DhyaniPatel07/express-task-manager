# Richardson Maturity Model Evaluation

## Task Management API Evaluation

| Level | Criterion | Does API Satisfy? | Evidence |
|-------|-----------|-------------------|----------|
| Level 0 | Single endpoint for all operations |  No | API uses multiple endpoints such as GET /tasks, POST /tasks, PUT /tasks/:id and DELETE /tasks/:id |
| Level 1 | Resources identified using URIs | Yes | Tasks are represented using the /tasks resource and individual tasks using /tasks/:id |
| Level 2 | Proper HTTP methods and status codes |  Yes | GET, POST, PUT and DELETE are used correctly with status codes 200, 201, 400, 404 and 500 |
| Level 3 | HATEOAS |  No | Hypermedia links are not included in API responses |

---

# Current Richardson Maturity Level

**Our Task Management API satisfies Level 2 of the Richardson Maturity Model.**

Reason:
- Separate resource URIs are used.
- Correct HTTP methods are used.
- Appropriate HTTP status codes are returned.
- HATEOAS links are not implemented.

---

# RESTful API Design Evaluation

The API follows REST principles by:

- Using resource-based URLs.
- Using GET for reading data.
- Using POST for creating data.
- Using PUT for updating data.
- Using DELETE for deleting data.
- Returning JSON responses.
- Returning appropriate HTTP status codes.

---

# HATEOAS Awareness (Level 3)

If the API were upgraded to Richardson Level 3, each task response could include navigation links.

Example:

```json
{
  "id": 1,
  "title": "Complete Practical",
  "completed": false,
  "_links": {
    "self": "/tasks/1",
    "update": "/tasks/1",
    "delete": "/tasks/1",
    "allTasks": "/tasks"
  }
}
```

These links allow the client to discover available actions without prior knowledge of the API.

---

# Conclusion

The Task Management API currently achieves **Richardson Maturity Model Level 2** because it uses resource-based URIs, proper HTTP methods and appropriate status codes. To achieve Level 3, HATEOAS links should be added to every API response.