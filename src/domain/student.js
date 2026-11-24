const { ValidationError } = require('../errors');

const FIELDS = ['name', 'email', 'department'];
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateStudent(input, { partial = false } = {}) {
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

  for (const field of FIELDS) {
    if (!partial && !(field in input)) {
      errors[field] = `${field} is required.`;
    } else if (field in input && (typeof input[field] !== 'string' || !input[field].trim())) {
      errors[field] = `${field} must be a non-empty string.`;
    }
  }

  if (typeof input.email === 'string' && input.email.trim() && !EMAIL_PATTERN.test(input.email.trim())) {
    errors.email = 'email must be a valid email address.';
  }

  if (Object.keys(errors).length) throw new ValidationError(errors);

  const result = {};
  for (const field of FIELDS) {
    if (field in input) result[field] = input[field].trim();
  }
  if ('email' in result) result.email = result.email.toLowerCase();
  return result;
}

function createStudent(id, input) {
  return Object.freeze({ id, ...validateStudent(input) });
}

module.exports = { createStudent, validateStudent };
