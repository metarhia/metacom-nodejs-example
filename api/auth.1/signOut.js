'use strict';

const auth = require('./store.js');

module.exports = (context) => async () => {
  if (context.session) {
    await auth.deleteSession(context.session.token);
    context.client.finalizeSession();
  }
  return {};
};
