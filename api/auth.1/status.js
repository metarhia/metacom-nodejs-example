'use strict';

module.exports = (context) => async () => {
  if (!context.session) return { authenticated: false };
  const { login } = context.session.state;
  return { authenticated: true, login };
};
