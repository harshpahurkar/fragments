// src/model/fragment.js
const { randomUUID } = require('crypto');

class Fragment {
  constructor({
    id = randomUUID(),
    owner,
    contentType = 'text/plain',
    size = 0,
    created = new Date().toISOString(),
    updated = new Date().toISOString(),
  }) {
    this.id = id;
    this.owner = owner;
    this.contentType = contentType;
    this.size = size;
    this.created = created;
    this.updated = updated;
  }
}

module.exports = Fragment;

// Helper to detect supported content types
Fragment.isSupportedType = function (type) {
  if (!type) return false;
  // accept any text/* types for now
  return (
    type === 'text/plain' ||
    type.startsWith('text/') ||
    // also accept JSON payloads
    type === 'application/json'
  );
};
