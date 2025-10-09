const { hashEmail } = require('../../src/hash');

describe('hash utility', () => {
  test('hashEmail returns a hex sha256 for emails', () => {
    const h = hashEmail('user@example.com');
    expect(typeof h).toBe('string');
    expect(h.length).toBe(64);
  });

  test('hashEmail handles falsy values', () => {
    expect(hashEmail(null)).toBeNull();
    expect(hashEmail(undefined)).toBeNull();
  });
});
