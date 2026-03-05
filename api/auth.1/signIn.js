'use strict';

const auth = require('./store.js');

module.exports = (context) => async ({ login, password }) => {
  if (!login || !password) {
    const err = new Error('Login and password are required');
    err.code = 400;
    return err;
  }
  const user = auth.getUser(login);
  if (!user || user.password !== password) {
    const err = new Error('Invalid credentials');
    err.code = 401;
    return err;
  }
  const token = auth.generateToken();
  await auth.createSession(token, { login });
  context.client.startSession(token, { login });
  return { token, login };
};
