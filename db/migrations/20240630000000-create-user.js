
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: 'actions_unique',
      },
      role: {
        type: Sequelize.ENUM('teacher', 'student'),
        allowNull: false,
        defaultValue: 'student',
        unique: 'actions_unique',
      },
      status: {
        type: Sequelize.ENUM('suspend', 'activate'),
        allowNull: false,
        defaultValue: 'activate',
        unique: 'actions_unique',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    }, {
      uniqueKeys: {
        actions_unique: {
          fields: ['email', 'role', 'status'],
        },
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Users');
  },
};
