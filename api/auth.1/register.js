'use strict';

const auth = require('./store.js');

module.exports =
  (context) =>
  async ({ login, password }) => {
    if (context.session) {
      const err = new Error('Already authenticated');
      err.code = 403;
      return err;
    }
    if (!login || !password) {
      const err = new Error('Login and password are required');
      err.code = 400;
      return err;
    }
    auth.registerUser(login, password);
    return { login };
  };
