# Student and Course Management API

A small REST API implementing complete CRUD lifecycles for students and courses. It is designed for a Web Technology Lab assignment and replaces manual Postman checks with repeatable Jest and Supertest integration tests.

## Features

- Create, list, retrieve, fully replace, partially update, and delete students and courses
- Automatically generated integer IDs
- Unique student emails and course codes
- Field-level input validation
- Correct HTTP status codes and `Location` headers
- RFC 9457 Problem Details error responses
- Request IDs and basic request logging
- Environment-based server configuration
- Isolated, in-memory data stores and automated integration tests

## Technologies

Node.js, Express.js, CommonJS, dotenv, Jest, and Supertest.

## API endpoints

| Method | Endpoint | Purpose | Success |
| --- | --- | --- | --- |
| GET | `/` | Health check | 200 |
| POST | `/students` | Create a student | 201 |
| GET | `/students` | List students | 200 |
| GET | `/students/:id` | Retrieve a student | 200 |
| PUT | `/students/:id` | Replace all student fields | 200 |
| PATCH | `/students/:id` | Update selected student fields | 200 |
| DELETE | `/students/:id` | Delete a student | 204 |
| POST | `/courses` | Create a course | 201 |
| GET | `/courses` | List courses | 200 |
| GET | `/courses/:id` | Retrieve a course | 200 |
| PUT | `/courses/:id` | Replace all course fields | 200 |
| PATCH | `/courses/:id` | Update selected course fields | 200 |
| DELETE | `/courses/:id` | Delete a course | 204 |

The API returns 400 for malformed JSON, 404 for missing resources/endpoints, 409 for duplicate email/code values, 422 for validation failures, and 500 for unexpected errors.

## Architecture

```text
src/
├── app.js                 # Dependency wiring and Express application
├── server.js              # Server startup only
├── config.js              # Environment configuration
├── errors.js              # Application error types
├── domain/                # Validation and normalization rules
├── repositories/          # In-memory data access
├── services/              # CRUD and uniqueness business logic
├── routes/                # Express routers and HTTP controllers
└── middleware/            # Logging and centralized error handling
tests/                     # Integration and service tests
```

Requests flow through routes to services and then repositories. `app.js` creates and injects the repositories into the services. Calling `createApp()` produces fresh stores, which lets tests remain independent. `server.js` is the only file that calls `listen()`.

## Install and run

Requirements: Node.js and npm.

```bash
npm ci
npm start
```

The default address is `http://localhost:3000`. Copy `.env.example` to `.env` to set a different `PORT` or `NODE_ENV`.

Run every automated test without starting the server:

```bash
npm test
```

## Example

Request:

```http
POST /students
Content-Type: application/json

{
  "name": "Ayesha Rahman",
  "email": "ayesha@example.com",
  "department": "CSE"
}
```

Response (`201 Created`, with `Location: /students/1`):

```json
{
  "id": 1,
  "name": "Ayesha Rahman",
  "email": "ayesha@example.com",
  "department": "CSE"
}
```

## Storage limitation

All data is held in memory. Restarting the process erases it, and the design is not suitable for multiple server instances. A persistent database would be the next step for production use.

## AI-use disclosure

AI assistance was used to help implement, test, and document this assignment. The generated work was executed and verified locally; the project owner remains responsible for reviewing and explaining the submitted code.
