const request = require('supertest');
const { createTestApp } = require('./helpers');

const course = {
  name: 'Web Technology',
  code: 'CSE-410',
  credits: 3,
};

describe('Course API integration', () => {
  test('performs the complete course CRUD lifecycle', async () => {
    const app = createTestApp();

    const created = await request(app)
      .post('/courses')
      .send(course)
      .expect(201)
      .expect('Location', '/courses/1');
    expect(created.body).toEqual({ id: 1, ...course });
    const id = created.body.id;

    const list = await request(app).get('/courses').expect(200);
    expect(list.body).toEqual([created.body]);

    const fetched = await request(app).get(`/courses/${id}`).expect(200);
    expect(fetched.body).toEqual(created.body);

    const replaced = await request(app)
      .put(`/courses/${id}`)
      .send({ name: 'Advanced Web Technology', code: 'CSE-411', credits: 4 })
      .expect(200);
    expect(replaced.body).toEqual({
      id,
      name: 'Advanced Web Technology',
      code: 'CSE-411',
      credits: 4,
    });

    const patched = await request(app)
      .patch(`/courses/${id}`)
      .send({ credits: 3 })
      .expect(200);
    expect(patched.body).toEqual({ ...replaced.body, credits: 3 });

    await request(app).delete(`/courses/${id}`).expect(204).expect('');
    await request(app).get(`/courses/${id}`).expect(404);
    const emptyList = await request(app).get('/courses').expect(200);
    expect(emptyList.body).toEqual([]);
  });

  test('rejects invalid course fields with field-level messages', async () => {
    const response = await request(createTestApp())
      .post('/courses')
      .send({ name: '', code: '', credits: 0 })
      .expect(422);

    expect(response.body.errors).toEqual({
      name: 'name must be a non-empty string.',
      code: 'code must be a non-empty string.',
      credits: 'credits must be a positive integer.',
    });
  });

  test('requires all fields on PUT and rejects an empty PATCH', async () => {
    const app = createTestApp();
    await request(app).post('/courses').send(course).expect(201);

    const put = await request(app).put('/courses/1').send({ name: 'Only Name' }).expect(422);
    expect(put.body.errors).toMatchObject({ code: 'code is required.', credits: 'credits is required.' });

    const patch = await request(app).patch('/courses/1').send({}).expect(422);
    expect(patch.body.errors.body).toMatch(/At least one field/);
  });

  test('normalizes and enforces unique course codes', async () => {
    const app = createTestApp();
    const first = await request(app)
      .post('/courses')
      .send({ ...course, code: 'cse-410' })
      .expect(201);
    expect(first.body.code).toBe('CSE-410');

    const duplicate = await request(app)
      .post('/courses')
      .send({ ...course, name: 'Duplicate' })
      .expect(409);
    expect(duplicate.body).toMatchObject({ title: 'Resource conflict', status: 409 });
  });

  test('returns 404 for a nonexistent course', async () => {
    const response = await request(createTestApp()).delete('/courses/999').expect(404);
    expect(response.body).toMatchObject({ title: 'Course not found', status: 404 });
  });
});
