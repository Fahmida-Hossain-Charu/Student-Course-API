const request = require('supertest');
const { createTestApp } = require('./helpers');

const student = {
  name: 'Ayesha Rahman',
  email: 'ayesha@example.com',
  department: 'CSE',
};

describe('Student API integration', () => {
  test('performs the complete student CRUD lifecycle', async () => {
    const app = createTestApp();

    const created = await request(app)
      .post('/students')
      .send(student)
      .expect(201)
      .expect('Location', '/students/1');
    expect(created.body).toEqual({ id: 1, ...student });
    const id = created.body.id;

    const list = await request(app).get('/students').expect(200);
    expect(list.body).toEqual([created.body]);

    const fetched = await request(app).get(`/students/${id}`).expect(200);
    expect(fetched.body).toEqual(created.body);

    const replaced = await request(app)
      .put(`/students/${id}`)
      .send({ name: 'Ayesha Islam', email: 'ayesha.islam@example.com', department: 'EEE' })
      .expect(200);
    expect(replaced.body).toEqual({
      id,
      name: 'Ayesha Islam',
      email: 'ayesha.islam@example.com',
      department: 'EEE',
    });

    const patched = await request(app)
      .patch(`/students/${id}`)
      .send({ department: 'CSE' })
      .expect(200);
    expect(patched.body).toEqual({ ...replaced.body, department: 'CSE' });

    await request(app).delete(`/students/${id}`).expect(204).expect('');
    await request(app).get(`/students/${id}`).expect(404);
    const emptyList = await request(app).get('/students').expect(200);
    expect(emptyList.body).toEqual([]);
  });

  test('rejects invalid fields with field-level messages', async () => {
    const response = await request(createTestApp())
      .post('/students')
      .send({ name: '', email: 'invalid', department: '' })
      .expect(422);

    expect(response.body.errors).toEqual({
      name: 'name must be a non-empty string.',
      email: 'email must be a valid email address.',
      department: 'department must be a non-empty string.',
    });
  });

  test('requires every field on PUT but allows selected fields on PATCH', async () => {
    const app = createTestApp();
    await request(app).post('/students').send(student).expect(201);

    const put = await request(app).put('/students/1').send({ name: 'Only Name' }).expect(422);
    expect(put.body.errors).toMatchObject({
      email: 'email is required.',
      department: 'department is required.',
    });

    const patch = await request(app).patch('/students/1').send({ name: 'New Name' }).expect(200);
    expect(patch.body).toEqual({ id: 1, ...student, name: 'New Name' });
  });

  test('rejects duplicate email addresses case-insensitively', async () => {
    const app = createTestApp();
    await request(app).post('/students').send(student).expect(201);

    const response = await request(app)
      .post('/students')
      .send({ ...student, name: 'Another Student', email: 'AYESHA@EXAMPLE.COM' })
      .expect(409);

    expect(response.body).toMatchObject({ title: 'Resource conflict', status: 409 });
  });

  test('returns 404 for a nonexistent student', async () => {
    const response = await request(createTestApp()).get('/students/999').expect(404);
    expect(response.body).toMatchObject({ title: 'Student not found', status: 404 });
  });

  test('fresh app instances isolate stored students', async () => {
    const firstApp = createTestApp();
    const secondApp = createTestApp();
    await request(firstApp).post('/students').send(student).expect(201);

    const response = await request(secondApp).get('/students').expect(200);
    expect(response.body).toEqual([]);
  });
});
