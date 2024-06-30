const {DATABASE} = require('../config');

// for Sequelize CLI migration purpose
const initial = {
  database: 'b5mntfvi9hiezhgslrde',
  username: 'u7xmfnjrboqy9zgj',
  password: 'B1ADxjUjGZv9NF5hliBf',
  host: 'b5mntfvi9hiezhgslrde-mysql.services.clever-cloud.com',
  dialect: 'mysql',
};

module.exports = {
  development: {
    database: DATABASE.DATABASE || initial.database,
    username: DATABASE.USERNAME || initial.username,
    password: DATABASE.PASSWORD || initial.password,
    host: DATABASE.HSOT || initial.host,
    dialect: DATABASE.DIALECT || initial.dialect,
  },
  test: initial,
  production: {
    database: DATABASE.DATABASE || initial.database,
    username: DATABASE.USERNAME || initial.username,
    password: DATABASE.PASSWORD || initial.password,
    host: DATABASE.HSOT || initial.host,
    dialect: DATABASE.DIALECT || initial.dialect,
  },
};
