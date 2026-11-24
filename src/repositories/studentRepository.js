class StudentRepository {
  constructor() {
    this.students = new Map();
    this.nextId = 1;
  }

  create(data) {
    const student = Object.freeze({ id: this.nextId++, ...data });
    this.students.set(student.id, student);
    return student;
  }

  findAll() {
    return Array.from(this.students.values());
  }

  findById(id) {
    return this.students.get(id);
  }

  findByEmail(email, excludeId) {
    return this.findAll().find((student) => student.email === email && student.id !== excludeId);
  }

  update(id, data) {
    const student = Object.freeze({ id, ...data });
    this.students.set(id, student);
    return student;
  }

  delete(id) {
    return this.students.delete(id);
  }
}

module.exports = StudentRepository;
