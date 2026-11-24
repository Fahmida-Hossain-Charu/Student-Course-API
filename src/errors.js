class AppError extends Error {
  constructor(status, title, detail, options = {}) {
    super(detail);
    this.name = this.constructor.name;
    this.status = status;
    this.title = title;
    this.type = options.type || 'about:blank';
    this.errors = options.errors;
  }
}

class ValidationError extends AppError {
  constructor(errors) {
    super(422, 'Validation failed', 'One or more fields are invalid.', {
      type: 'https://example.com/problems/validation-error',
      errors,
    });
  }
}

class NotFoundError extends AppError {
  constructor(resource, id) {
    super(404, `${resource} not found`, `${resource} with ID ${id} does not exist.`);
  }
}

class ConflictError extends AppError {
  constructor(detail) {
    super(409, 'Resource conflict', detail);
  }
}

module.exports = { AppError, ValidationError, NotFoundError, ConflictError };
