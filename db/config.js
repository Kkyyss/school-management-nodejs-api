const {DATABASE} = require('../config');

module.exports = {
  development: DATABASE,
  test: DATABASE,
  production: DATABASE,
};
