const StudentRepository = require('../src/repositories/studentRepository');
const StudentService = require('../src/services/studentService');

describe('StudentService unit test', () => {
  test('applies normalization and uniqueness without HTTP', () => {
    const repository = new StudentRepository();
    const service = new StudentService(repository);

    const created = service.create({
      name: '  Karim Hasan  ',
      email: 'KARIM@EXAMPLE.COM',
      department: ' CSE ',
    });

    expect(created).toEqual({
      id: 1,
      name: 'Karim Hasan',
      email: 'karim@example.com',
      department: 'CSE',
    });
    expect(repository.findById(1)).toEqual(created);
    expect(() => service.create({
      name: 'Different Student',
      email: 'KARIM@example.com',
      department: 'EEE',
    })).toThrow('A student with email karim@example.com already exists.');
  });
});
