/** @type {import('@rspack/core').Configuration} */
const watchOptions = {
  aggregateTimeout: 200,
  ignored: ['**/node_modules/**', '**/dist/**', '**/.git/**'],
  poll: 1000,
};

export default () => ({ watchOptions });
