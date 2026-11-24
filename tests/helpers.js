const { createApp } = require('../src/app');

function createTestApp() {
  return createApp({ logger: { info: () => {} } });
}

module.exports = { createTestApp };
