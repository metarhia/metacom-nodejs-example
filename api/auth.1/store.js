'use strict';

const crypto = require('node:crypto');

const users = new Map([
  ['marcus', { login: 'marcus', password: 'marcus' }],
  ['admin', { login: 'admin', password: 'admin' }],
]);

const sessions = new Map();

module.exports = {
  getUser: (login) => users.get(login) ?? null,
  registerUser: (login, password) => void users.set(login, { login, password }),
  generateToken: () => crypto.randomUUID(),
  createSession: (token, data) => void sessions.set(token, data),
  deleteSession: (token) => void sessions.delete(token),
};
