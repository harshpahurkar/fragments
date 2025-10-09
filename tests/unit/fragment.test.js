const Fragment = require('../../src/model/fragment');

describe('Fragment class', () => {
  test('constructs with defaults and provided values', () => {
    const f = new Fragment({ owner: 'me' });
    expect(f).toHaveProperty('id');
    expect(f.owner).toBe('me');
    expect(f.contentType).toBe('text/plain');
    expect(f.size).toBe(0);
    expect(f.created).toBeTruthy();
  });

  test('allows overriding values', () => {
    const f = new Fragment({
      id: 'abc',
      owner: 'u',
      contentType: 'text/custom',
      size: 5,
      created: '2020-01-01T00:00:00Z',
    });
    expect(f.id).toBe('abc');
    expect(f.contentType).toBe('text/custom');
    expect(f.size).toBe(5);
    expect(f.created).toBe('2020-01-01T00:00:00Z');
  });
});
