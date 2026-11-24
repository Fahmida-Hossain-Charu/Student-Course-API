const request = require('supertest');
const { createTestApp } = require('./helpers');

describe('Application middleware and health check', () => {
  test('GET / returns API health and a request ID', async () => {
    const response = await request(createTestApp()).get('/').expect(200);

    expect(response.body).toEqual({ status: 'ok', service: 'student-course-api' });
    expect(response.headers['x-request-id']).toEqual(expect.any(String));
  });

  test('echoes a client-provided request ID', async () => {
    const response = await request(createTestApp())
      .get('/')
      .set('X-Request-ID', 'lab-test-123')
      .expect(200);

    expect(response.headers['x-request-id']).toBe('lab-test-123');
  });

  test('returns RFC 9457-style Problem Details for malformed JSON', async () => {
    const response = await request(createTestApp())
      .post('/students')
      .set('Content-Type', 'application/json')
      .send('{"name":')
      .expect(400)
      .expect('Content-Type', /application\/problem\+json/);

    expect(response.body).toMatchObject({
      type: 'about:blank',
      title: 'Malformed JSON',
      status: 400,
      detail: 'The request body contains invalid JSON.',
      instance: '/students',
    });
  });

  test('returns Problem Details for an unknown endpoint', async () => {
    const response = await request(createTestApp()).get('/missing').expect(404);

    expect(response.body).toMatchObject({
      title: 'Endpoint not found',
      status: 404,
      instance: '/missing',
    });
  });
});
