// src/model/fragments.js
// Simple in-memory fragment store for testing and development
const { randomUUID } = require('crypto');

const store = new Map(); // Map<owner, Map<id, fragment>>

function createFragment(owner, { content, contentType = 'text/plain' }) {
  const id = randomUUID();
  const fragment = { id, owner, content, contentType, created: new Date().toISOString() };
  if (!store.has(owner)) store.set(owner, new Map());
  store.get(owner).set(id, fragment);
  return fragment;
}

function listFragments(owner) {
  const userMap = store.get(owner);
  if (!userMap) return [];
  return Array.from(userMap.keys());
}

function getFragment(owner, id) {
  const userMap = store.get(owner);
  if (!userMap) return null;
  return userMap.get(id) || null;
}

function clearAll() {
  store.clear();
}

module.exports = { createFragment, listFragments, getFragment, clearAll };
