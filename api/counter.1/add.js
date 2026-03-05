'use strict';

module.exports = (context) => async ({ a = 0, b = 0 }) => {
  const result = a + b;
  console.log(`add: ${a} + ${b} = ${result}`);
  return { result };
};

module.exports.access = 'session';
