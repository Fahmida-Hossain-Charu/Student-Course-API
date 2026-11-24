const { ValidationError } = require('../errors');

const FIELDS = ['name', 'code', 'credits'];

function validateCourse(input, { partial = false } = {}) {
  const errors = {};

  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    throw new ValidationError({ body: 'Request body must be a JSON object.' });
  }

  const unknownFields = Object.keys(input).filter((field) => !FIELDS.includes(field));
  if (unknownFields.length) {
    errors.body = `Unknown field(s): ${unknownFields.join(', ')}.`;
  }

  if (partial && Object.keys(input).length === 0) {
    errors.body = 'At least one field is required for a partial update.';
  }

  for (const field of ['name', 'code']) {
    if (!partial && !(field in input)) {
      errors[field] = `${field} is required.`;
    } else if (field in input && (typeof input[field] !== 'string' || !input[field].trim())) {
      errors[field] = `${field} must be a non-empty string.`;
    }
  }

  if (!partial && !('credits' in input)) {
    errors.credits = 'credits is required.';
  } else if ('credits' in input && (!Number.isInteger(input.credits) || input.credits <= 0)) {
    errors.credits = 'credits must be a positive integer.';
  }

  if (Object.keys(errors).length) throw new ValidationError(errors);

  const result = {};
  for (const field of FIELDS) {
    if (field in input) result[field] = typeof input[field] === 'string' ? input[field].trim() : input[field];
  }
  if ('code' in result) result.code = result.code.toUpperCase();
  return result;
}

function createCourse(id, input) {
  return Object.freeze({ id, ...validateCourse(input) });
}

module.exports = { createCourse, validateCourse };
