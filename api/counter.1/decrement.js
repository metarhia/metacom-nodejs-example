'use strict';

module.exports = (context) => async ({ value = 1 }) => {
  const { state } = context.session;
  if (state.value === undefined) state.value = 0;
  state.value -= value;
  return { value: state.value };
};

module.exports.access = 'session';
