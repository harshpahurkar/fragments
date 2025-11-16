const request = require('supertest');
const app = require('../../src/app');
const { clearAll } = require('../../src/model/fragments');

beforeEach(() => {
  clearAll();
  delete process.env.API_URL;
});

describe('expand query, info and markdown->html', () => {
  test('GET /v1/fragments?expand=1 returns metadata objects', async () => {
    // create two fragments
    await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('one');

    await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('two');

    const res = await request(app)
      .get('/v1/fragments?expand=1')
      .auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.fragments)).toBe(true);
    expect(res.body.fragments.length).toBeGreaterThanOrEqual(2);
    // metadata objects should have id and contentType
    expect(res.body.fragments[0]).toHaveProperty('id');
    expect(res.body.fragments[0]).toHaveProperty('contentType');
  });

  test('GET /v1/fragments/:id/info returns metadata and .html converts markdown', async () => {
    const md = '# Hello';
    const create = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/markdown')
      .send(md);

    expect(create.statusCode).toBe(201);
    const id = create.body.fragment.id;

    const info = await request(app)
      .get(`/v1/fragments/${id}/info`)
      .auth('user1@email.com', 'password1');
    expect(info.statusCode).toBe(200);
    expect(info.body.fragment).toHaveProperty('id', id);

    const html = await request(app)
      .get(`/v1/fragments/${id}.html`)
      .auth('user1@email.com', 'password1');
    expect(html.statusCode).toBe(200);
    expect(html.type).toBe('text/html');
    expect(html.text).toMatch(/<h1.*>\s*Hello\s*<\/h1>/i);
  });
});
