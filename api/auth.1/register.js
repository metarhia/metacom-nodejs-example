'use strict';

const auth = require('./store.js');

module.exports = (context) => async ({ login, password }) => {
  if (!login || !password) {
    const err = new Error('Login and password are required');
    err.code = 400;
    return err;
  }
  if (password.length < 4) {
    const err = new Error('Password must be at least 4 characters');
    err.code = 400;
    return err;
  }
  auth.registerUser(login, password);
  return { login };
};
