'use strict';

module.exports =
  (context) =>
  async ({ a = 0, b = 0 }) => {
    const { login } = context.session.state;
    const result = a + b;
    console.log(`${login}: add ${a} + ${b} = ${result}`);
    return { result };
  };

module.exports.access = 'session';
