const dotenv = require('dotenv');

dotenv.config();

function toPort(value) {
  const port = Number(value);
  return Number.isInteger(port) && port > 0 && port <= 65535 ? port : 3000;
}

const config = Object.freeze({
  env: process.env.NODE_ENV || 'development',
  port: toPort(process.env.PORT || 3000),
});

module.exports = config;
