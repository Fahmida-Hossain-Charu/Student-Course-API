const { validateStudent } = require('../domain/student');
const { ConflictError, NotFoundError } = require('../errors');

class StudentService {
  constructor(repository) {
    this.repository = repository;
  }

  create(input) {
    const data = validateStudent(input);
    this.ensureUniqueEmail(data.email);
    return this.repository.create(data);
  }

  getAll() {
    return this.repository.findAll();
  }

  getById(id) {
    const student = this.repository.findById(id);
    if (!student) throw new NotFoundError('Student', id);
    return student;
  }

  replace(id, input) {
    this.getById(id);
    const data = validateStudent(input);
    this.ensureUniqueEmail(data.email, id);
    return this.repository.update(id, data);
  }

  update(id, input) {
    const current = this.getById(id);
    const changes = validateStudent(input, { partial: true });
    if (changes.email) this.ensureUniqueEmail(changes.email, id);
    return this.repository.update(id, { ...current, ...changes });
  }

  delete(id) {
    this.getById(id);
    this.repository.delete(id);
  }

  ensureUniqueEmail(email, excludeId) {
    if (this.repository.findByEmail(email, excludeId)) {
      throw new ConflictError(`A student with email ${email} already exists.`);
    }
  }
}

module.exports = StudentService;
