const { validateCourse } = require('../domain/course');
const { ConflictError, NotFoundError } = require('../errors');

class CourseService {
  constructor(repository) {
    this.repository = repository;
  }

  create(input) {
    const data = validateCourse(input);
    this.ensureUniqueCode(data.code);
    return this.repository.create(data);
  }

  getAll() {
    return this.repository.findAll();
  }

  getById(id) {
    const course = this.repository.findById(id);
    if (!course) throw new NotFoundError('Course', id);
    return course;
  }

  replace(id, input) {
    this.getById(id);
    const data = validateCourse(input);
    this.ensureUniqueCode(data.code, id);
    return this.repository.update(id, data);
  }

  update(id, input) {
    const current = this.getById(id);
    const changes = validateCourse(input, { partial: true });
    if (changes.code) this.ensureUniqueCode(changes.code, id);
    return this.repository.update(id, { ...current, ...changes });
  }

  delete(id) {
    this.getById(id);
    this.repository.delete(id);
  }

  ensureUniqueCode(code, excludeId) {
    if (this.repository.findByCode(code, excludeId)) {
      throw new ConflictError(`A course with code ${code} already exists.`);
    }
  }
}

module.exports = CourseService;
