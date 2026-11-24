const { AppError } = require('../errors');

function notFoundHandler(req, res) {
  res.status(404).type('application/problem+json').json({
    type: 'about:blank',
    title: 'Endpoint not found',
    status: 404,
    detail: `No endpoint matches ${req.method} ${req.originalUrl}.`,
    instance: req.originalUrl,
    requestId: req.id,
  });
}

function errorHandler(error, req, res, _next) {
  let problem = error;
  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    problem = new AppError(400, 'Malformed JSON', 'The request body contains invalid JSON.');
  } else if (!(error instanceof AppError)) {
    console.error(error);
    problem = new AppError(500, 'Internal Server Error', 'An unexpected error occurred.');
  }

  const body = {
    type: problem.type,
    title: problem.title,
    status: problem.status,
    detail: problem.message,
    instance: req.originalUrl,
    requestId: req.id,
  };
  if (problem.errors) body.errors = problem.errors;

  res.status(problem.status).type('application/problem+json').json(body);
}

module.exports = { notFoundHandler, errorHandler };
