

const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config.js')[env];
const { Sequelize } = require('sequelize');
const Users = require('./user');
const StudentTeachers = require('./studentteacher');

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config);
}
const models = [Users, StudentTeachers];
const db = models.reduce((acc, model) => {
  const definer = model(sequelize);

  acc[definer.name] = definer;
  return acc;
}, {});

Object.keys(db).forEach(modelName => {
  const modelDefiner = db[modelName];
  if (modelDefiner.associate) {
    modelDefiner.associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
