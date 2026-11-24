class CourseRepository {
  constructor() {
    this.courses = new Map();
    this.nextId = 1;
  }

  create(data) {
    const course = Object.freeze({ id: this.nextId++, ...data });
    this.courses.set(course.id, course);
    return course;
  }

  findAll() {
    return Array.from(this.courses.values());
  }

  findById(id) {
    return this.courses.get(id);
  }

  findByCode(code, excludeId) {
    return this.findAll().find((course) => course.code === code && course.id !== excludeId);
  }

  update(id, data) {
    const course = Object.freeze({ id, ...data });
    this.courses.set(id, course);
    return course;
  }

  delete(id) {
    return this.courses.delete(id);
  }
}

module.exports = CourseRepository;
