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
    tags = [],
  }) {
    this.id = id;
    this.owner = owner;
    this.contentType = contentType;
    this.size = size;
    this.created = created;
    this.updated = updated;
    this.tags = Array.isArray(tags) ? tags : [];
  }
}

module.exports = Fragment;

// Helper to detect supported content types
Fragment.isSupportedType = function (type) {
  if (!type) return false;

  const validTypes = [
    // Text types
    'text/plain',
    'text/markdown',
    'text/html',
    'text/csv',
    // Application types
    'application/json',
    'application/yaml',
    // Image types
    'image/png',
    'image/jpeg',
    'image/webp',
    'image/gif',
    'image/avif',
  ];

  // Check exact match first
  if (validTypes.includes(type)) return true;

  // Also accept any text/* types
  if (type.startsWith('text/')) return true;

  return false;
};

// Helper to get valid conversions for a content type
Fragment.getValidConversions = function (contentType) {
  if (!contentType) return [];

  // Text conversions
  if (contentType === 'text/plain') {
    return ['.txt'];
  }
  if (contentType === 'text/markdown') {
    return ['.md', '.html', '.htm', '.txt'];
  }
  if (contentType === 'text/html') {
    return ['.html', '.htm', '.txt'];
  }
  if (contentType === 'text/csv') {
    return ['.csv', '.txt'];
  }
  if (contentType === 'application/json') {
    return ['.json', '.txt'];
  }
  if (contentType === 'application/yaml') {
    return ['.yaml', '.yml', '.txt'];
  }

  // Image conversions - all images can convert to each other
  if (contentType.startsWith('image/')) {
    return ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.avif'];
  }

  return [];
};
